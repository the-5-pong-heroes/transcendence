import { Get, Put, Controller, Post, Body, UseGuards, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";

import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { UserService } from "src/user/user.service";
import { Oauth42Service } from "src/auth/auth42/Oauth42.service";
import { Generate2FAService } from "./2FA/generate.service";
import { EnableService } from "./2FA/enable2FA.service";
import { VerifyService } from "./2FA/verify.service";
import { UserDto, TwoFADto, AuthCallbackDto, SignInDto, SignUpDto } from "./dto";
import { Auth } from "@prisma/client";
import { GoogleOauthGuard } from "./google/google-auth.guards";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private Oauth42: Oauth42Service,
    private userService: UserService,
    private Generate2FA: Generate2FAService,
    private enable2FAService: EnableService,
    private verify2FAService: VerifyService,
  ) {}

  @Post("Oauth42/login")
  async getUserByToken(@Req() req: Request) {
    return await this.authService.getUserByToken(req);
  }

  // @Post("Oauth")
  // async userOauthCreationInDataBase(@Req() req: Request, @Res() res: Response, @Body() userData: UserDto) {
  //   await this.authService.handleDataBaseCreation(req, res, userData);
  // }

  @Get("auth42/callback")
  async getToken(@Req() req: Request, @Res() res: Response) {
    if (req.signedCookies.access_token) return; // TODO CHECK USER !!!!
    const authCallbackDto = new AuthCallbackDto();
    authCallbackDto.code = req.query.code as string;
    const token = await this.Oauth42.accessToken(authCallbackDto.code);
    const user42infos = await this.Oauth42.access42UserInformation(token.access_token);
    this.authService.createCookies(res, token);
    if (!user42infos) return;
    else {
      const userExists = await this.userService.getUserByEmail(user42infos.email);
      if (!userExists) this.authService.createDataBase42User(user42infos, token, user42infos.login, false);
      else {
        this.authService.updateCookies(res, token, userExists);
        if (!userExists.auth?.twoFAactivated) return; // ou /Profile ?
        else {
          this.verify2FAService.updateVerify2FA(userExists);
          this.Generate2FA.sendActivationMail(userExists);
          //res.redirect(301, `http://localhost:5173/Login?displayPopup=true`);
        }
      }
    }
  }

  @Post("signup")
  async signUp(@Res({ passthrough: true }) res: Response, @Body() data: SignUpDto): Promise<void> {
    await this.authService.signUp(res, data);
  }

  @UseGuards(AuthGuard("local"))
  @Post("signin")
  async signIn(@Res({ passthrough: true }) res: Response, @Body() signInDto: SignInDto): Promise<void> {
    console.log("🌈 signInDto: ", signInDto);
    await this.authService.signIn(res, signInDto);
  }

  @Get("signout")
  async signout(@Res() res: Response): Promise<void> {
    await this.authService.signOut(res);
  }

  @Get("user")
  async getUser(@Req() req: Request, @Res() res: Response): Promise<void> {
    await this.authService.getUser(req, res);
  }

  @Get("twoFAactivated")
  async getTwoFAactivated(@Req() req: Request, @Res() res: Response) {
    const accessToken = req.signedCookies.access_token;
    if (!accessToken) return res.status(200).json({ message: "User not connected" });
    const user = await this.authService.validateUser(accessToken);
    if (!user) return res.status(404).json({ message: "Invalid token" });
    if (!user.auth) return res.status(200).json({ message: "User has no authentication" });
    return res.status(200).json({ twoFAactivated: user.auth.twoFAactivated });
  }

  @Put("twoFAtoggle")
  async twoFAtoggle(@Req() req: Request, @Res() res: Response) {
    const { isToggled } = req.body;
    const accessToken = req.signedCookies.access_token;
    if (!accessToken) return res.status(200).json({ message: "User not connected" });
    const user = await this.authService.validateUser(accessToken);
    if (!user) return res.status(404).json({ message: "Invalid token" });
    if (!user.auth) return res.status(200).json({ message: "User has no authentication" });
    await this.authService.twoFAtoggle(user.auth.email, isToggled);
    return res.status(200);
  }

  @Get("2FA/generate")
  async generate2FA(@Req() req: Request) {
    return this.Generate2FA.generateService(req);
  }

  @Post("2FA/verify")
    async verify2FA(@Req() req: Request, @Res() res: Response, @Body() data: TwoFADto) {
      return this.verify2FAService.validate2FA(req, res, data.code);
  }
  // @Post("2FA/verify")
  // async verify2FA(@Req() req: Request, @Res() res: Response, @Body("twoFACode") code: string) {
  //   return this.verify2FAService.validate2FA(req, res, code);
  // }

  @Get("2FA/disable")
  async disable2FA(@Req() req: Request) {
    return this.enable2FAService.disable2FA(req);
  }

  @Get("2FA/status")
  async status2FA(@Req() req: Request) {
    return this.enable2FAService.status2FA(req);
  }

  /*****************  GOOGLE AUTH  ****************/

  @Get("google")
  @UseGuards(GoogleOauthGuard)
  async googleLogin() {
    console.log("🐥");
    /* void */
  }

  @Get("google/callback")
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req: any, @Res() res: Response) {
    console.log("🌵");
    await this.authService.signInGoogle(res, req.user);
  }

  // @Get("token")
  // async checkIfTokenValid(@Req() req: Request, @Res() res: Response) {
  //   return this.authService.checkIfTokenValid(req, res);
  // }
}
