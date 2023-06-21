import { Injectable, BadRequestException, Req, Res, Body, HttpStatus } from "@nestjs/common";
import { Request, Response, request } from "express";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { Auth, User } from "@prisma/client";
import { UserService } from "src/user/user.service";
import { SignInDto, SignUpDto } from "./dto";
import { CreateUserDto } from "../user/dto";
import { PrismaService } from "../database/prisma.service";
import { Oauth42Service } from "src/auth/auth42/Oauth42.service";
import { GoogleService } from "src/auth/google/google.service";
import { UserDto } from "./dto";
import { Generate2FAService } from "./2FA/generate.service";
import { EnableService } from "./2FA/enable2FA.service";
import { VerifyService } from "./2FA/verify.service";
import { UserWithAuth } from "src/common/@types";
import { CLIENT_URL } from "src/common/constants";

export interface UserAuth {
  message: string;
  user: User;
}

interface GoogleUserInfos {
  email: string;
  name: string;
  accessToken: string;
}

interface Token {
  access_token: string | undefined;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private prisma: PrismaService,
    private Oauth42: Oauth42Service,
    private googleService: GoogleService,
    private Generate2FA: Generate2FAService,
    private enable2FAService: EnableService,
    private verify2FAService: VerifyService,
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

  async signUp(@Res({ passthrough: true }) res: Response, data: SignUpDto): Promise<void> {
    const { name, email, password } = data;

    const userByName = await this.userService.findUserByName(name);
    if (userByName) {
      res.status(HttpStatus.CONFLICT).json({ message: "User already exists" });
      return;
    }
    const userAuth = await this.findOne(email);
    if (userAuth) {
      res.status(HttpStatus.CONFLICT).json({ message: "Email already used" });
      return;
    }
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    const newUser = new CreateUserDto(name, email, hash);
    const createdUser = await this.userService.create(newUser);

    const payload = { email: email, sub: createdUser.id };
    const accessToken = this.jwtService.sign(payload);

    await this.prisma.auth.update({
      where: { userId: createdUser.id },
      data: {
        accessToken: accessToken,
      },
    });
    res
      .cookie("access_token", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        expires: new Date(Date.now() + 86400 * 1000),
        signed: true,
      })
      .status(200)
      .json({ message: "Welcome !", user: createdUser });
  }

  async validateUserJwt(signInDto: SignInDto): Promise<Auth> {
    const { email, password } = signInDto;
    const userAuth = await this.findOne(email);
    if (!userAuth) {
      throw new BadRequestException("User doesn't exist");
    }
    if (userAuth.password) {
      const isMatch = await bcrypt.compare(password, userAuth.password);
      if (!isMatch) {
        throw new BadRequestException("Invalid credentials");
      }
    }
    return userAuth;
  }

  async signIn(@Res({ passthrough: true }) res: Response, signInDto: SignInDto): Promise<void> {
    const auth = await this.validateUserJwt(signInDto);
    const payload = { email: auth.email, sub: auth.userId };
    const user = await this.userService.findOne(auth.userId);
    const accessToken = this.jwtService.sign(payload);
    await this.prisma.auth.update({
      where: {
        userId: auth.userId,
      },
      data: {
        accessToken: accessToken,
      },
    });
    if (auth.twoFAactivated) {
      this.verify2FAService.updateVerify2FA(user);
      this.Generate2FA.sendActivationMail(user);
    }
    res
      .cookie("access_token", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        expires: new Date(Date.now() + 86400 * 1000),
        signed: true,
      })
      .status(200)
      .json({ message: "Welcome back !", user: user, twoFA: auth.twoFAactivated });
  }

  async signInGoogle(@Res() res: Response, userInfos: GoogleUserInfos): Promise<void> {
    const userByEmail = await this.findOne(userInfos.email);
    let user: UserWithAuth;
    if (userByEmail) {
      await this.prisma.auth.update({
        where: {
          userId: userByEmail.userId,
        },
        data: {
          accessToken: userInfos.accessToken,
        },
      });
      user = await this.userService.findOne(userByEmail.userId);
    } else {
      user = await this.googleService.createDataBaseUserFromGoogle(
        userInfos.accessToken,
        userInfos.name,
        userInfos.email,
        true,
      );
    }
    let url = CLIENT_URL;
    if (user.auth?.twoFAactivated) {
      this.verify2FAService.updateVerify2FA(user);
      this.Generate2FA.sendActivationMail(user);
      url = `${CLIENT_URL}/Login?displayPopup=true`;
    }
    res
      .cookie("access_token", userInfos.accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        expires: new Date(Date.now() + 86400 * 1000),
        signed: true,
      })
      .redirect(301, url);
    console.log("End signInGoogle");
  }

  async signOut(res: Response): Promise<void> {
    res.cookie("access_token", "", { expires: new Date() }).status(200).json({ message: "Successfully logout !" });
  }

  async validateUser(access_token: string): Promise<UserWithAuth | null> {
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
    try {
      const access_token = req.signedCookies.access_token;
      if (!access_token) {
        return res.status(200).json({ message: "User not connected", user: null });
      }
      const user = await this.validateUser(access_token);
      if (!user) {
        return res.status(404).json({ message: "Invalid token" });
      }
      if (user.auth?.twoFAactivated && !user.auth.otp_verified) {
        console.log("🌪️ twofa =", user.auth.twoFAactivated, "otp_verified =", user.auth.otp_verified);
        return res.status(200).json({ message: "User not connected", user: null });
      }
      res.status(200).json({ message: "Successfully fetched user", user: user });
    } catch (error) {
      res.status(403).json({ message: "Forbidden" });
    }
  }

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

  async getUserByToken(req: Request): Promise<(User & { auth: Auth | null }) | null> {
    const token = req.signedCookies.access_token;
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

  // async handleDataBaseCreation(@Req() req: Request, @Res() res: Response, @Body() userDto: UserDto) {
  //   const token: string = req.signedCookies.access_token;
  //   const user42infos = await this.Oauth42.access42UserInformation(token);
  //   if (user42infos) {
  //     const finalUser = await this.Oauth42.createDataBase42User(
  //       user42infos,
  //       token,
  //       req.body.name,
  //       req.body.isRegistered,
  //     );
  //     return res.status(200).json({
  //       statusCode: 200,
  //       path: finalUser,
  //     });
  //   }
  //   await this.googleService.handleGoogleUserCreation(res, req);
  // }

  async createCookies(@Res() res: Response, token: any) {
    const cookies = res.cookie("access_token", token.access_token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      expires: new Date(Date.now() + 600000),
      signed: true,
    });
    const Googlecookies = res.cookie("FullToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      expires: new Date(Date.now() + 600000),
      signed: true,
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

  // async checkIfTokenValid(@Req() req: Request, @Res() res: Response) {
  //   const token: string = req.signedCookies.access_token;

  //   const token42Valid = await this.Oauth42.access42UserInformation(token); // check token from user if user is from 42
  //   const dataGoogleValid = await this.googleService.getUserFromGoogleByCookies(req); // check now if the token from google is valid
  //   if (!token42Valid && !dataGoogleValid) {
  //     throw new BadRequestException("InvalidToken", {
  //       description: "Json empty, the token is invalid",
  //     });
  //   }
  //   return res.status(200).json({
  //     statusCode: 200,
  //     path: request.url,
  //   });
  // }
}
