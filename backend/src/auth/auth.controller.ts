import { Injectable, Get, Controller, Post, Body, UseGuards, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";

import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../user/dto";
import { User } from "@prisma/client";
import { UserDto } from "./dto";
import { UserService } from "src/user/user.service";
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
    private readonly authService: AuthService,
    private Oauth42: Oauth42Service,
    private userService: UserService,
    private googleService: GoogleService,
  ) {}

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

  /***************      LAURA'S CODE      ***************/

  @Get("Oauth42/login")
  async getUserByToken(@Req() req: Request) {
    return await this.authService.getUserByToken(req);
  }

  @Post("Oauth")
  async userOauthCreationInDataBase(@Req() req: Request, @Res() res: Response, @Body() data: UserDto) {
    await this.authService.handleDataBaseCreation(req, res, data);
  }

  @Get("auth42/callback")
  async getToken(@Req() req: any, @Res() res: Response) {
    const codeFromUrl = req.query.code as string;
    console.log("request = ", req);
    const token = await this.Oauth42.accessToken(codeFromUrl);
    const user42infos = await this.Oauth42.access42UserInformation(token.access_token);
    this.authService.createCookies(res, token);
    const userExists = await this.userService.findUserAuthByEmail(user42infos.email);
    this.authService.updateCookies(res, token, userExists);
    this.authService.RedirectConnectingUser(req, res, userExists?.email);
  }

  @Get("token")
  async checkIfTokenValid(@Req() req: Request, @Res() res: Response) {
    return this.authService.checkIfTokenValid(req, res);
  }

  // @Get("google/callback")
  // async handleGoogleRedirection(@Req() req: Request, @Res() res: Response) {
  //   const codeFromUrl = req.query.code as string;
  //   const token: any = await this.googleService.getTokenFromGoogle(codeFromUrl);
  //   const userInfos: any = await this.googleService.getUserFromGoogle(token);
  //   console.log("🌞 userInfos: ", userInfos);
  //   if (userInfos) {
  //     this.authService.createCookies(res, userInfos);
  //     const userExists = await this.userService.findUserAuthByEmail(userInfos.email);
  //     this.authService.updateCookies(res, token, userExists);
  //     this.authService.RedirectConnectingUser(req, res, userExists?.email);
  //   }
  // }
}
