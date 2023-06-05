import { BadRequestException, Req, Res, Body, Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { Request, Response, request } from "express";
import { Oauth42Service } from "src/auth/auth42/Oauth42.service";
import { UserDto } from "./dto";
import { GoogleService } from "src/auth/google/google.service";
import { User } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private Oauth42: Oauth42Service, private googleService: GoogleService) {}

  async createDataBase42User(user42: any, token: any, username: string, isRegistered: boolean) {
    try {
      const user = await this.prisma.user.create({
        data: {
          name: username,
          status: "ONLINE",
          lastLogin: new Date(),
          auth: {
            create: {
              accessToken: token.access_token,
              isRegistered: isRegistered,
              email: user42.email,
              twoFAactivated: false,
              otp_enabled: false,
              otp_validated: false,
              otp_verified: false,
            },
          },
        },
        include: {
          auth: true,
        },
      });
      return user;
    } catch (error) {
      throw new BadRequestException("Failed to create the user");
    }
  }

  async RedirectConnectingUser(@Req() req: Request, @Res() res: Response, email: string | null | undefined) {
    if (!email) res.redirect(301, `http://localhost:5173/Profile`);
    else res.redirect(301, `http://localhost:5173/`);
  }

  /**
   * Returns the user initiating this request.
   *
   * An error is thrown when the cookies in the request headers do not contain a valid token.
   */
  async getUserByToken(req: Request): Promise<User> {
    const token = req.cookies["token"];
    if (!token) throw new BadRequestException("Failed to get the user by token (falsy token)");
    try {
      const user = await this.prisma.user.findFirstOrThrow({
        where: { auth: { accessToken: token } },
      });
      return user;
    } catch (error) {
      throw new BadRequestException("Failed to get the user by token (no user found)");
    }
  }

  async handleDataBaseCreation(@Req() req: Request, @Res() res: Response, @Body() userDto: UserDto) {
    const token: string = req.cookies.token;
    const user42infos = await this.Oauth42.access42UserInformation(token);
    if (user42infos) {
      const finalUser = await this.Oauth42.createDataBase42User(
        user42infos,
        token,
        req.body.name,
        req.body.isRegistered,
      );
      return res.status(200).json({
        statusCode: 200,
        path: finalUser,
      });
    }
    await this.googleService.handleGoogleUserCreation(res, req);
  }

  async createCookies(@Res() res: Response, token: any) {
    const cookies = res.cookie("token", token.access_token, {
      expires: new Date(new Date().getTime() + 60 * 24 * 7 * 1000), // expires in 7 days
      httpOnly: true, // for security
    });
    // const Googlecookies = res.cookie("FullToken", token,
    // {
    //   expires: new Date(new Date().getTime() + 60 * 24 * 7 * 1000), // expires in 7 days
    //   httpOnly: true, // for security
    // });
  }

  async updateCookies(@Res() res: Response, token: any, userInfos: any) {
    try {
      if (userInfos) {
        const name = userInfos.id;
        const user = await this.prisma.auth.update({
          where: {
            userId: name,
          },
          data: { accessToken: token.access_token },
        });
        return user;
      } else return null;
    } catch (error) {
      throw new BadRequestException("Failed to update the cookies");
    }
  }

  async deleteCookies(@Res() res: Response) {
    try {
      res.clearCookie("token").clearCookie("FullToken").end();
    } catch (error) {
      throw new BadRequestException("Failed to delete the cookies");
    }
  }

  async checkIfTokenValid(@Req() req: Request, @Res() res: Response) {
    const token: string = req.cookies.token;

    const token42Valid = await this.Oauth42.access42UserInformation(token); // check token from user if user is from 42
    const dataGoogleValid = await this.googleService.getUserFromGoogleByCookies(req); // check now if the token from google is valid
    if (!token42Valid && !dataGoogleValid) {
      throw new BadRequestException("InvalidToken", {
        description: "Json empty, the token is invalid",
      });
    }
    return res.status(200).json({
      statusCode: 200,
      path: request.url,
    });
  }
}
