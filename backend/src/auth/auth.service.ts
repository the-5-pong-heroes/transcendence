import { Injectable, BadRequestException, Res, HttpStatus } from "@nestjs/common";
import { Request, Response, CookieOptions } from "express";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { Auth } from "@prisma/client";
import { UserService } from "src/user/user.service";
import { SignInDto, SignUpDto } from "./dto";
import { CreateUserDto } from "../user/dto";
import { PrismaService } from "../database/prisma.service";
import { Oauth42Service } from "src/auth/auth42/Oauth42.service";
import { Generate2FAService } from "./2FA/generate.service";
import { VerifyService } from "./2FA/verify.service";
import { UserWithAuth } from "src/common/@types";
import { CLIENT_URL } from "src/common/constants";
import { UserGoogleInfos, User42Infos } from "./interface";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "strict",
  expires: new Date(Date.now() + 86400 * 1000),
  signed: true,
};

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private prisma: PrismaService,
    private Oauth42: Oauth42Service,
    private Generate2FA: Generate2FAService,
    private verify2FAService: VerifyService,
  ) {}

  /*****************************************************************************************/
  /*                                      USER HANDLING                                    */
  /*****************************************************************************************/

  async findOne(email: string): Promise<Auth | null> {
    if (!email) {
      return null;
    }
    const result = await this.prisma.auth.findUnique({
      where: { email: email },
    });
    return result;
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
        return res.status(200).json({ message: "User not connected", user: null });
      }
      res.status(200).json({ message: "Successfully fetched user", user: user });
    } catch (error) {
      res.status(403).json({ message: "Forbidden" });
    }
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

  /*****************************************************************************************/
  /*                                       42 LOGIN                                        */
  /*****************************************************************************************/

  async createDataBase42User(user42: User42Infos, token: string, username: string, isRegistered: boolean) {
    try {
      const user = await this.prisma.user.create({
        data: {
          name: username,
          status: "ONLINE",
          lastLogin: new Date(),
          auth: {
            create: {
              accessToken: token,
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

  /*****************************************************************************************/
  /*                                     GOOGLE LOGIN                                      */
  /*****************************************************************************************/

  async signInGoogle(@Res() res: Response, userInfos: UserGoogleInfos): Promise<void> {
    const userByEmail = await this.findOne(userInfos.email);
    let user: UserWithAuth;
    if (userByEmail) {
      user = await this.userService.findOne(userByEmail.userId);
      this.updateTokenCookies(res, userInfos.accessToken, userByEmail.userId);
    } else {
      user = await this.createDataBaseUserFromGoogle(userInfos, true);
      this.createCookies(res, userInfos.accessToken);
    }
    let url = CLIENT_URL;
    if (user.auth?.twoFAactivated) {
      this.verify2FAService.updateVerify2FA(user);
      this.Generate2FA.sendActivationMail(user);
      url = `${CLIENT_URL}/Login?displayPopup=true`;
    }
    res.cookie("access_token", userInfos.accessToken, cookieOptions).redirect(301, url);
  }

  async createDataBaseUserFromGoogle(userInfos: UserGoogleInfos, isRegistered: boolean): Promise<UserWithAuth> {
    try {
      const user = await this.prisma.user.create({
        data: {
          name: userInfos.name,
          auth: {
            create: {
              accessToken: userInfos.accessToken,
              isRegistered: isRegistered,
              email: userInfos.email,
            },
          },
          status: "ONLINE",
          lastLogin: new Date(),
        },
        include: { auth: true },
      });
      return user;
    } catch (error) {
      throw new BadRequestException("Error to create the user to the database");
    }
  }

  /*****************************************************************************************/
  /*                                 USER LOGIN WITH JWT                                   */
  /*****************************************************************************************/

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
    this.createCookies(res, accessToken);
    res.status(200).json({ message: "Welcome !", user: createdUser });
  }

  async signIn(@Res({ passthrough: true }) res: Response, signInDto: SignInDto): Promise<void> {
    const auth = await this.validateUserJwt(signInDto);
    const payload = { email: auth.email, sub: auth.userId };
    const user = await this.userService.findOne(auth.userId);
    const accessToken = this.jwtService.sign(payload);
    this.updateTokenCookies(res, accessToken, auth.userId);
    if (auth.twoFAactivated) {
      this.verify2FAService.updateVerify2FA(user);
      this.Generate2FA.sendActivationMail(user);
    }
    res
      .cookie("access_token", accessToken, cookieOptions)
      .status(200)
      .json({ message: "Welcome back !", user: user, twoFA: auth.twoFAactivated });
  }

  /*****************************************************************************************/
  /*                                   COOKIES HANDLING                                    */
  /*****************************************************************************************/

  async createCookies(@Res() res: Response, token: string): Promise<void> {
    res.cookie("access_token", token, cookieOptions);
  }

  async updateTokenCookies(@Res() res: Response, token: string, id: string): Promise<void> {
    try {
      await this.prisma.auth.update({
        where: {
          userId: id,
        },
        data: {
          accessToken: token,
        },
      });
    } catch (error) {
      throw new BadRequestException("Failed to update the cookies");
    }
  }

  async signOut(res: Response): Promise<void> {
    res.cookie("access_token", "", { expires: new Date() }).status(200).json({ message: "Successfully logout !" });
  }
}
