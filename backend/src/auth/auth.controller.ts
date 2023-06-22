import { Get, Controller, Post, Body, UseGuards, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { UserService } from "src/user/user.service";
import { Oauth42Service } from "src/auth/auth42/Oauth42.service";
import { Generate2FAService } from "./2FA/generate.service";
import { EnableService } from "./2FA/enable2FA.service";
import { VerifyService } from "./2FA/verify.service";
import { TwoFADto, AuthCallbackDto, SignInDto, SignUpDto } from "./dto";
import { GoogleOauthGuard } from "./google/google-auth.guards";
import { TwoFA, UserGoogleInfos } from "./interface";

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

  /*****************************************************************************************/
  /*                                     GET LOGGED USER                                   */
  /*****************************************************************************************/

  @Get("user")
  async getUser(@Req() req: Request, @Res() res: Response): Promise<void> {
    await this.authService.getUser(req, res);
  }

  /*****************************************************************************************/
  /*                                        42 AUTH                                        */
  /*****************************************************************************************/

  // @Post("Oauth42/login")
  // async getUserByToken(@Req() req: Request): Promise<UserWithAuth | null> {
  //   const token = req.signedCookies.access_token;
  //   if (token && token !== undefined) {
  //     return await this.authService.validateUser(token);
  //   }
  //   return null;
  // }

  // @Post("Oauth")
  // async userOauthCreationInDataBase(@Req() req: Request, @Res() res: Response): Promise<void> {
  //   await this.authService.handleDataBaseCreation(req, res);
  // }

  @Get("auth42/callback")
  async getToken(@Req() req: Request, @Res() res: Response): Promise<void> {
    const authCallbackDto = new AuthCallbackDto();
    authCallbackDto.code = req.query.code as string;
    const token = await this.Oauth42.accessToken(authCallbackDto.code);
    const user42infos = await this.Oauth42.access42UserInformation(token);
    this.authService.createCookies(res, token);
    if (!user42infos) {
      res.redirect(301, "http://localhost:5173/");
      return;
    } else {
      const userExists = await this.userService.getUserByEmail(user42infos.email);
      if (!userExists) this.authService.createDataBase42User(user42infos, token, user42infos.login, false);
      else {
        this.authService.updateTokenCookies(res, token, userExists.id);
        if (!userExists.auth?.twoFAactivated) {
          res.redirect(301, "http://localhost:5173/");
          return;
        } else {
          this.verify2FAService.updateVerify2FA(userExists);
          this.Generate2FA.sendActivationMail(userExists);
          res.redirect(301, `http://localhost:5173/`);
          return;
        }
      }
    }
    // res.redirect(301, `http://localhost:5173/`);
  }

  /*****************************************************************************************/
  /*                                  SIMPLE USER LOGIN                                    */
  /*****************************************************************************************/

  @Post("signup")
  async signUp(@Res({ passthrough: true }) res: Response, @Body() data: SignUpDto): Promise<void> {
    await this.authService.signUp(res, data);
  }

  @UseGuards(AuthGuard("local"))
  @Post("signin")
  async signIn(@Res({ passthrough: true }) res: Response, @Body() signInDto: SignInDto): Promise<void> {
    await this.authService.signIn(res, signInDto);
  }

  /*****************************************************************************************/
  /*                                         LOGOUT                                        */
  /*****************************************************************************************/

  @Get("signout")
  async signout(@Res() res: Response): Promise<void> {
    await this.authService.signOut(res);
  }

  /*****************************************************************************************/
  /*                                      2FA HANDLING                                     */
  /*****************************************************************************************/

  @Get("2FA/generate")
  async generate2FA(@Req() req: Request): Promise<void> {
    return this.Generate2FA.generateService(req);
  }

  @Post("2FA/verify")
  async verify2FA(@Req() req: Request, @Res() res: Response, @Body() data: TwoFADto) {
    return this.verify2FAService.validate2FA(req, res, data.code);
  }

  @Get("2FA/disable")
  async disable2FA(@Req() req: Request): Promise<void> {
    return this.enable2FAService.disable2FA(req);
  }

  @Get("2FA/status")
  async status2FA(@Req() req: Request): Promise<TwoFA> {
    return this.enable2FAService.status2FA(req);
  }

  /*****************************************************************************************/
  /*                                      GOOGLE AUTH                                      */
  /*****************************************************************************************/

  @Get("google")
  @UseGuards(GoogleOauthGuard)
  async googleLogin(): Promise<void> {
    /* void */
  }

  @Get("google/callback")
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Res({ passthrough: true }) res: Response, @Req() req: Request): Promise<void> {
    if (!req.user) {
      return;
    }
    await this.authService.signInGoogle(res, req.user as UserGoogleInfos);
  }
}
