import { HttpException, HttpStatus, Injectable, Req, Res } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { PrismaService } from "src/database/prisma.service";
import { Request, Response } from "express";
import { google } from "googleapis";
import { User } from "@prisma/client";
import { ConfigService } from "@nestjs/config";

interface Token {
  access_token: string | null | undefined;
}

@Injectable({})
export class GoogleService {
  constructor(private prisma: PrismaService, private userService: UserService, private config: ConfigService) {}

  async handleGoogleUserCreation(@Res() res: Response, @Req() req: Request) {
    try {
      const userGoogleInfos = await this.getUserFromGoogleByCookies(req);
      if (userGoogleInfos && userGoogleInfos.email) {
        const finalUser = await this.createDataBaseUserFromGoogle(
          userGoogleInfos.access_token,
          req.body.name,
          userGoogleInfos.email,
          req.body.isRegistered,
        );
        return res.status(200).json({
          statusCode: 200,
          path: finalUser,
        });
      }
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: "Error to create the user to the database",
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getUserFromGoogleByCookies(@Req() req: Request) {
    const token: string = req.cookies.FullToken;
    const data = await this.getUserFromGoogle(token);
    return data;
  }

  async getUserFromGoogle(tokens: any) {
    try {
      const oauth2Client = await this.getOauth2ClientGoogle();
      await oauth2Client.setCredentials(tokens);
      const { data } = await google.oauth2("v2").userinfo.get({ auth: oauth2Client });
      const userInfos = {
        email: data.email,
        access_token: tokens.access_token,
      };
      return userInfos;
    } catch (error) {
      console.log("Fetch google user doesnt work, next step is testing with 42api");
    }
    return null;
  }

  async getOauth2ClientGoogle() {
    const client_id = this.config.get("GOOGLE_CLIENT_ID");
    const secret = this.config.get("GOOGLE_SECRET");
    const redirect_url = this.config.get("GOOGLE_REDIRECT_URI");
    const oauth2Client = new google.auth.OAuth2(client_id, secret, redirect_url);
    const scopes = [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ];
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline", //refresh token
      scope: scopes,
    });
    return oauth2Client;
  }

  // async createDataBaseUserFromGoogle(@Res() res: Response, userGoogle: any, name: string, isRegistered: boolean) {
  async createDataBaseUserFromGoogle(
    accessToken: string,
    name: string,
    email: string,
    isRegistered: boolean,
  ): Promise<User> {
    try {
      const user = await this.prisma.user.create({
        data: {
          name: name,
          auth: {
            create: {
              accessToken: accessToken,
              isRegistered: isRegistered,
              email: email,
            },
          },
          status: "ONLINE",
          lastLogin: new Date(),
        },
      });
      return user;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: "Error to create the user to the database",
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getTokenFromGoogle(code: string) {
    const oauth2Client = await this.getOauth2ClientGoogle();
    const { tokens } = await oauth2Client.getToken(code);
    const token: Token = {
      access_token: tokens.access_token,
    };
    await oauth2Client.setCredentials({
      access_token: tokens.access_token,
    });
    // const userInfoClient = google.oauth2("v2").userinfo;
    // const userInfoResponse = await userInfoClient.get({
    //   auth: oauth2Client,
    // });
    const userInfoClient = google.oauth2("v2").userinfo;
    const userInfoResponse = await userInfoClient.get({
      auth: oauth2Client,
    });
    return token;
  }
}
