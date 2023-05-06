import { HttpException, HttpStatus, Injectable, Req, Res } from "@nestjs/common";
import { UserService } from "src/users/users.service";
import { PrismaService } from "src/database/prisma.service";
import { Request, Response } from "express";
import { google } from 'googleapis';


@Injectable({})
export class GoogleService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async handleGoogleUserCreation(@Res() res: Response, @Req() req: Request) {

    try {
      const userGoogleInfos = await this.getUserFromGoogleByCookies(req)
      if (userGoogleInfos) {
        const finalUser = await this.createDataBaseUserFromGoogle
      (
        res,
        userGoogleInfos,
        req.body.name,
        req.body.isRegistered
      )
        return res.status(200).json(
        {
          statusCode: 200,
          path: finalUser,
        });
    }} catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: "Error to create the user to the database"
        }, HttpStatus.BAD_REQUEST);
      };
  }

  async getUserFromGoogleByCookies(@Req() req: Request) {
    const token: string = req.cookies.FullToken;
    const data = await this.getUserFromGoogle(token)
    return data;
  }

  async getUserFromGoogle(tokens: any) {
    try {
    const oauth2Client = await this.getOauth2ClientGoogle();
    await oauth2Client.setCredentials(tokens);
    const { data } = await google.oauth2('v2').userinfo.get({ auth: oauth2Client });
    let userInfos = {
			email: data.email,
            access_token: tokens.access_token,
		}
    return userInfos;
  }
  catch(error) {
    console.log("Fetch google user doesnt work, next step is testing with 42api")
  }
    return null;
  }

  async getOauth2ClientGoogle() {
    const oauth2Client = new google.auth.OAuth2(
      '710896193743-ghevbabaa9s9f94qlsaqbvbrnlj30hgv.apps.googleusercontent.com',
      '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',
      'http://localhost:3333/auth/google/callback'
    );
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ];
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline', //refresh token
      scope: scopes
    });
    return oauth2Client;
  }

  async createDataBaseUserFromGoogle(
    @Res() res: Response,
    userGoogle: any,
    name: string,
    isRegistered: boolean

  ) {
    try {    
      const user = await this.prisma.user.create({
        data: { 
            name: name,
            auth: {
                create: {
                    password: 'test',
                    isRegistered: isRegistered,
                    accessToken: userGoogle.access_token,
                    email: userGoogle.email,
                }
            },
            status: "ONLINE",
            last_login: new Date()
        },
      });
      return user;
    } catch (error) {
      throw new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,
        error: "Error to create the user to the database"
      }, HttpStatus.BAD_REQUEST);
      };
}

async getTokenFromGoogle(code :string)
{  
  const oauth2Client = await this.getOauth2ClientGoogle();
  console.log(oauth2Client);
  const {tokens} = await oauth2Client.getToken(code);
  console.log(tokens);
  const token = {
    access_token: tokens.access_token,
  }
  return token;
}
}