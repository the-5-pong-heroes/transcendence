import { Injectable, BadRequestException, Req, Res, Body, HttpStatus } from "@nestjs/common";
import { Request, Response, request } from "express";
import * as bcrypt from "bcrypt";

import { Auth } from "@prisma/client";
import { UserService } from "src/user/user.service";
import { User } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";
import { Oauth42Service } from "src/auth/auth42/Oauth42.service";
import { UserDto } from "./dto";
import { CLIENT_URL } from "src/common/constants";

export interface UserAuth {
  message: string;
  user: User;
}

interface Token {
  access_token: string | undefined;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private prisma: PrismaService,
    private Oauth42: Oauth42Service,
  ) {}

  async findOne(email: string): Promise<Auth | null> {
    if (!email) {
      return null;
    }
    const result = await this.prisma.auth.findUnique({
      where: { email: email },
    });
    return result;
  }

  async signOut(res: Response): Promise<void> {
    res.cookie("access_token", "", { expires: new Date() }).status(200).json({ message: "Successfully logout !" });
  }

  async validateUser(access_token: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          auth: {
            accessToken: access_token,
          },
        },
        include: {
          auth: true,
        },
      });
      return user;
    } catch {
      return null;
    }
  }

  async getUser(req: Request, res: Response): Promise<any> {
    const access_token = req.cookies.access_token;
    if (!access_token) {
      return res.status(200).json({ message: "User not connected", user: null });
    }
    //const user = await this.validateUser(access_token);
    const user = await this.prisma.user.findFirst({
      where: {
        auth: {
          accessToken: access_token,
        },
      },
      include: {
        auth: true,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "Invalid token" });
    }
    if (user.auth?.twoFAactivated && !user.auth.otp_verified) {
      return res.status(200).json({ message: "User not connected", user: null });
    }
    res.status(200).json({ message: "Successfully fetched user", user: user });
  }

  /***********       LAURA'S CODE      ***********/

  async createDataBase42User(user42: any, token: Token, username: string, isRegistered: boolean) {
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

  async getUserByToken(req: Request): Promise<(User & { auth: Auth | null }) | null> {
    const token = req.cookies.access_token;
    //if (!token) throw new BadRequestException("Failed to get the user by token (falsy token)");
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          auth: {
            accessToken: token,
          },
        },
        include: {
          auth: true,
        },
      });
      return user;
    } catch (error) {
      throw new BadRequestException("Failed to get the user by token (no user found)");
    }
  }

  async createCookies(@Res() res: Response, token: any) {
    const cookies = res.cookie("access_token", token.access_token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      expires: new Date(Date.now() + 600000),
    });
    return cookies;
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
      res.clearCookie("access_token").clearCookie("FullToken").end();
    } catch (error) {
      throw new BadRequestException("Failed to delete the cookies");
    }
  }

  async checkIfTokenValid(@Req() req: Request, @Res() res: Response) {
    const token: string = req.cookies.access_token;

    const token42Valid = await this.Oauth42.access42UserInformation(token); // check token from user if user is from 42
    if (!token42Valid) {
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
