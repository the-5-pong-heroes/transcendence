import { Injectable, Get, Controller, Post, Body, UseGuards, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";

import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../users/dto";
import { User } from "@prisma/client";
import { UserDto } from "./dto";
import { UsersService } from "src/users/users.service";
import { Oauth42Service } from "src/auth/auth42/Oauth42.service";
import { GoogleService } from "src/auth/google/google.service";

@Injectable()
export class GoogleOauthGuard extends AuthGuard("google") {}

export interface UserAuth {
  message: string;
  user: User;
}

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private Oauth42: Oauth42Service,
    private userService: UserService,
    private googleService: GoogleService,
    private Generate2FA: Generate2FAService,
    private enable2FAService: EnableService,
    private verify2FAService: VerifyService,
  ) {}

  @Get("Oauth42/login")
  async getUserByToken(@Req() req: Request) {
    return await this.authService.getUserByToken(req);
  }

  @Post("Oauth")
  async userOauthCreationInDataBase(@Req() req: Request, @Res() res: Response, @Body() UserDto: UserDto) {
    await this.authService.handleDataBaseCreation(req, res, UserDto);
  }

  @Get("auth42/callback")
  async getToken(@Req() req: Request, @Res() res: Response) {
    const codeFromUrl = req.query.code as string;
    const token = await this.Oauth42.accessToken(codeFromUrl);
    const user42infos = await this.Oauth42.access42UserInformation(token.access_token);
    this.authService.createCookies(res, token);
    if (!user42infos.email) res.redirect(301, `http://localhost:5173/`);
    else {
      const userExists = await this.userService.getUserByEmail(user42infos.email);
      if (!userExists) this.authService.createDataBase42User(user42infos, token, user42infos.login, false);
      else {
        this.authService.updateCookies(res, token, userExists);
        if (!userExists.auth?.twoFAactivated) res.redirect(301, `http://localhost:5173/`); // ou /Profile ?
        else this.Generate2FA.sendActivationMail(userExists); //2FA page
      }
    }
    //res.redirect(301, `http://localhost:5173/`);
    //this.authService.RedirectConnectingUser(req,res, userExists?.auth.email);
  }

  @Post("signup")
  async signUp(@Res({ passthrough: true }) res: Response, @Body() data: CreateUserDto): Promise<void> {
    await this.authService.signUp(res, data);
  }

  @UseGuards(AuthGuard("local"))
  @Post("signin")
  async signIn(@Req() req: any, @Res({ passthrough: true }) res: Response): Promise<void> {
    await this.authService.signIn(res, req.user);
  }

  @Get("signout")
  async signout(@Res() res: Response): Promise<void> {
    await this.authService.signOut(res);
  }

  @Get("user")
  async getUser(@Req() req: any, @Res() res: Response): Promise<void> {
    await this.authService.getUser(req, res);
  }

  @Get("google")
  @UseGuards(GoogleOauthGuard)
  async googleLogin() {
    /* void */
  }

  @Get("google/callback")
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req: any, @Res() res: Response) {
    await this.authService.signInGoogle(res, req.user);
  }

  @Get("token")
  async checkIfTokenValid(@Req() req: Request, @Res() res: Response) {
    return this.authService.checkIfTokenValid(req, res);
  }

  @Get("2FA/enable")
  async enable2FA(@Req() req: Request, @Res() res: Response) {
    return this.enable2FAService.EnableService(req, res);
  }

  @Post("2FA/generate")
  async generate2FA(@Req() req: Request, @Res() res: Response) {
    return this.Generate2FA.generateService(req, res);
  }

  @Get("2FA/verify")
  async verify2FA(@Req() req: Request, @Res() res: Response) {
    return this.verify2FAService.validate2FA(req, res);
  }

  //    @Get("google/callback")
  //      async handleGoogleRedirection(@Req() req: Request, @Res() res: Response) {
  //       const codeFromUrl = req.query.code as string;
  //       const token: any = await this.googleService.getTokenFromGoogle(codeFromUrl);
  //       const userInfos : any = await this.googleService.getUserFromGoogle(token);
  //       this.authService.createCookies(res, userInfos);
  //       const userExists = await this.userService.getUserByEmail(userInfos.email);
  //       this.authService.updateCookies(res, token, userExists);
  //       //this.authService.RedirectConnectingUser(req, res, userExists?.email);
  //    }

  //    @Get("logout")
  //    async deleteCookies(@Req() req: Request, @Res() res: Response) {
  //      await this.authService.deleteCookies(res);
  //    }
}

