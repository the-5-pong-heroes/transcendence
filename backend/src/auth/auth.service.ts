import { UserService } from "src/user/user.service";
import { VerifyService } from "./2FA/verify.service";
import { UserWithAuth } from "src/common/@types";
import { Generate2FAService } from "./2FA/generate.service";
import { Injectable, BadRequestException, Res, NotFoundException, ForbiddenException } from "@nestjs/common";
import { Request, Response, CookieOptions } from "express";
import { Auth } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";
import { Oauth42Service } from "src/auth/auth42/Oauth42.service";
import { User42Infos, UserAuth } from "./interface";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private prisma: PrismaService,
    private Oauth42: Oauth42Service,
    private generate2FA: Generate2FAService,
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

  async getUser(req: Request): Promise<UserAuth> {
    try {
      const access_token = req.signedCookies.access_token;
      if (!access_token) {
        return { message: "User not connected", user: null };
      }
      const user = await this.validateUser(access_token);
      if (!user) {
        throw new NotFoundException("Invalid token");
      }
      if (user.auth?.twoFAactivated && !user.auth.otp_verified) {
        return { message: "User not connected", user: null };
      }
      return { message: "Successfully fetched user", user: user };
    } catch (error) {
      throw new ForbiddenException();
    }
  }

  /*****************************************************************************************/
  /*                                       42 LOGIN                                        */
  /*****************************************************************************************/

  async proceedCode(@Res() res: Response, code: string): Promise<void> {
    try {
      const token = await this.Oauth42.accessToken(code);
      const userInfo = await this.Oauth42.access42UserInformation(token);
      if (!userInfo) return; // an error has already been logged
      const userExists = await this.userService.getUserByEmail(userInfo.email);
      this.createCookies(res, token); // creates or updates the cookies
      if (!userExists) {
        // this is a new user
        this.createDataBase42User(userInfo, token, userInfo.login, false);
      } else {
        // not a new user, not its first connection
        this.updateTokenCookies(res, token, userExists.id);
        if (userExists.auth?.twoFAactivated) {
          this.verify2FAService.updateVerify2FA(userExists);
          this.generate2FA.sendActivationMail(userExists);
        }
      }
    } catch (errToken) {
      console.error(`❌ Failed to get a token: ${errToken}`);
	  throw new BadRequestException("Invalid code");
    }
  }

  async foundUsername(username : string): Promise<boolean> {
    try {
        const updatedUser = await this.prisma.user.findFirst({
            where: { name: username }
        });
        if (updatedUser)
            return true;
        else
            return false;
    }
    catch (error) {
        throw new BadRequestException(`Failed founding username`);
    }
  }


  async verifyUsername(username : string): Promise<string> {
    try {
        while (await this.foundUsername(username)) {
            username = `${username}bis`;
		}
		return username;
    } catch (error) {
        throw new BadRequestException(`Failed founding username`);
    }
  }

  async createDataBase42User(user42: User42Infos, token: string, username: string, isRegistered: boolean) {
    try {
	const updatedUsername = await this.verifyUsername(username);
      const user = await this.prisma.user.create({
        data: {
          name: updatedUsername,
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
      throw new BadRequestException(`Failed to create the user: ${error}`);
    }
  }

  /*****************************************************************************************/
  /*                                   COOKIES HANDLING                                    */
  /*****************************************************************************************/

  async createCookies(@Res() res: Response, token: string): Promise<void> {
	let date = new Date();
	date.setDate(date.getDate() + 1)
	const cookieOptions: CookieOptions = {
		httpOnly: true,
		secure: false,
		sameSite: "strict",
		expires: date,
		signed: true,
	};
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
    res.cookie("access_token", "", { expires: new Date() }).status(200).json({ message: "Successfully logout!" });
  }
}
