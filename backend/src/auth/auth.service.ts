import { Injectable, BadRequestException, Req, Res, Body, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response, request } from "express";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { Auth } from "@prisma/client";
import { UsersService } from "src/users/users.service";
import { SignInDto, SignUpDto } from "./dto";
import { CreateUserDto } from "../users/dto";
import { User } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";
import { Oauth42Service } from "src/auth/auth42/Oauth42.service";
import { GoogleService } from "src/auth/google/google.service";
import { UserDto } from "./dto";
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

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private prisma: PrismaService,
    private Oauth42: Oauth42Service,
    private googleService: GoogleService,
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

    const userByName = await this.usersService.findUserByName(name);
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
    const createdUser = await this.usersService.create(newUser);

    const payload = { email: email, sub: createdUser.id };
    const accessToken = this.jwtService.sign(payload);
    await this.prisma.user.update({
      where: { id: createdUser.id },
      data: {
        auth: {
          update: {
            accessToken: accessToken,
          },
        },
      },
    });
    res
      .cookie("access_token", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        expires: new Date(Date.now() + 86400 * 1000),
      })
      .status(200)
      .json({ message: "Welcome !", user: createdUser });
  }

  async validateUserJwt(signInDto: SignInDto): Promise<any> {
    const { email, password } = signInDto;
    const userAuth = await this.findOne(email);
    if (!userAuth) {
      throw new BadRequestException("User doesn't exist");
    }
    const isMatch = await bcrypt.compare(password, userAuth.password);
    if (!isMatch) {
      throw new BadRequestException("Invalid credentials");
    }
    const { password: _, ...result } = userAuth;
    return result;
  }

  async signIn(@Res({ passthrough: true }) res: Response, auth: Auth): Promise<void> {
    const payload = { email: auth.email, sub: auth.userId };
    const user = await this.usersService.findOne(auth.userId);
    const accessToken = this.jwtService.sign(payload);

    res
      .cookie("access_token", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        expires: new Date(Date.now() + 86400 * 1000),
      })
      .status(200)
      .json({ message: "Welcome back !", user: user });
  }

  async signInGoogle(@Res() res: Response, userInfos: GoogleUserInfos): Promise<void> {
    const userByEmail = await this.findOne(userInfos.email);
    let user;
    if (userByEmail) {
      await this.prisma.auth.update({
        where: {
          userId: userByEmail.userId,
        },
        data: {
          accessToken: userInfos.accessToken,
        },
      });
      user = await this.usersService.findOne(userByEmail.userId);
    } else {
      user = await this.googleService.createDataBaseUserFromGoogle(
        userInfos.accessToken,
        userInfos.name,
        userInfos.email,
        true,
      );
    }
    res
      .cookie("access_token", userInfos.accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        expires: new Date(Date.now() + 86400 * 1000),
      })
      .redirect(301, CLIENT_URL);
  }

  async signOut(res: Response): Promise<void> {
    res.cookie("access_token", "", { expires: new Date() }).status(200).json({ message: "Successfully logout !" });
  }

  async validateUser(access_token: string): Promise<User | null> {
    let userId;
    if (!access_token) {
      return null;
    }
    try {
      const decodedToken = this.jwtService.verify(access_token);
      userId = decodedToken.sub;
    } catch (error) {
      try {
        const auth = await this.prisma.auth.findFirst({
          where: {
            accessToken: access_token,
          },
        });
        if (!auth) {
          return null;
        }
        userId = auth.userId;
      } catch {
        return null;
      }
    }
    const user = await this.usersService.findOne(userId);
    return user;
  }

  async getUser(req: Request, res: Response): Promise<any> {
    const access_token = req.cookies.access_token;
    if (!access_token) {
      return res.status(200).json({ message: "User not connected", user: null });
    }
    const user = await this.validateUser(access_token);
    if (!user) {
      return res.status(404).json({ message: "Invalid token" });
    }
    // console.log("🙇🏼‍♀️", user);
    res.status(200).json({ message: "Successfully fetched user", user: user });
  }

  /***********       LAURA'S CODE      ***********/

  async createDataBase42User(user42: any, token: string, username: string, isRegistered: boolean) {
    try {
      const user = await this.prisma.user.create({
        data: {
          name: username,
          auth: {
            create: {
              accessToken: token,
              isRegistered: isRegistered,
              email: user42.email,
              password: "test",
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

  async RedirectConnectingUser(@Req() req: Request, @Res() res: Response, email: string | null | undefined) {
    if (!email) res.redirect(301, `http://e1r2p7.clusters.42paris.fr:5173/registration`);
    else res.redirect(301, `http://e1r2p7.clusters.42paris.fr:5173/`);
  }

  // async getUserByToken(req: Request) {
  //   try {
  //     const accessToken = req.cookies.token;
  //     const user = await this.prisma.auth.findFirst({
  //       where: {
  //         accessToken: accessToken,
  //       },
  //     });
  //     if (!user) {
  //       throw new HttpException(
  //         {
  //           status: HttpStatus.BAD_REQUEST,
  //           error: "Error to get the user by token1",
  //         },
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }
  //     return user;
  //   } catch (error) {
  //     throw new HttpException(
  //       {
  //         status: HttpStatus.BAD_REQUEST,
  //         error: "Error to get the user by token2",
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }

  async getUserByToken(req: Request) {
    try {
      const accessToken = req.cookies.token;
      const user = await this.validateUser(accessToken);
      // const user = await this.prisma.auth.findFirst({
      //   where: {
      //     accessToken: accessToken,
      //   },
      // });
      // if (!user) {
      //   throw new HttpException(
      //     {
      //       status: HttpStatus.BAD_REQUEST,
      //       error: "Error to get the user by token1",
      //     },
      //     HttpStatus.BAD_REQUEST,
      //   );
      // }
      return user;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: "Error to get the user by token2",
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async handleDataBaseCreation(@Req() req: Request, @Res() res: Response, @Body() data: UserDto) {
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
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      expires: new Date(Date.now() + 86400 * 1000),
    });
    const Googlecookies = res.cookie("FullToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      expires: new Date(Date.now() + 86400 * 1000),
    });
  }

  async updateCookies(@Res() res: Response, token: any, userInfos: any) {
    try {
      if (userInfos) {
        const name = userInfos.id;
        const user = await this.prisma.auth.update({
          where: { userId: name },
          data: { accessToken: token.access_token },
        });
        return user;
      } else return null;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: "Error to update the cookies",
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteCookies(@Res() res: Response) {
    try {
      res.clearCookie("token").clearCookie("FullToken").end();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: "Error to update the cookies",
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async checkIfTokenValid(@Req() req: Request, @Res() res: Response) {
    const token: string = req.cookies.token;

    const token42Valid = await this.Oauth42.access42UserInformation(token); // check token from user if user is from 42
    const dataGoogleValid = await this.googleService.getUserFromGoogleByCookies(req); // check now if the token from google is valid
    if (!token42Valid && !dataGoogleValid) {
      throw new BadRequestException("InvalidToken", {
        cause: new Error(),
        description: "Json empty, the token is invalid",
      });
    }
    return res.status(200).json({
      statusCode: 200,
      path: request.url,
    });
  }

  // import { ForbiddenException, Injectable } from "@nestjs/common";
  // import { PrismaService } from "../database/prisma.service";
  // import { AuthDto } from "./dto";
  // import * as argon from "argon2";
  // import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

  // @Injectable()
  // export class AuthService {
  //   constructor(private prisma: PrismaService) {}
  //   async signup(dto: AuthDto) {
  //   const hash = await argon.hash(dto.password);
  //   try {
  //     const user = await this.prisma.user.create({
  //       data: {
  //         email: dto.email,
  //         hash,
  //       },
  //     });
  //     delete user.hash;
  //     return user;
  //   } catch (error) {
  //     if (error instanceof PrismaClientKnownRequestError) {
  //       if (error.code === "P2002") {
  //         throw new ForbiddenException("Credentials taken");
  //       }
  //     }
  //   }
  //   throw Error;
  // }

  // async signin(dto: AuthDto) {
  // const user = await this.prisma.user.findUnique({
  //   where: {
  //     email: dto.email,
  //   },
  // });
  // if (!user) throw new ForbiddenException("Credentials incorrect");
  // const pwMatches = await argon.verity(user.hash, dto.password);
  // if (!pwMatches) throw new ForbiddenException("Credentials incorrect");
  // delete user.hash;
  // return user;
  // }
}
