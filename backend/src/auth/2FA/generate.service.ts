import { MailerService } from "@nestjs-modules/mailer";
import { HttpException, HttpStatus, Injectable, Req, Res } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import * as bcrypt from "bcrypt";
import * as fs from "fs";
import * as path from "path";
import { Request, Response } from "express";
import { User } from "@prisma/client";
import { Auth } from "@prisma/client";

const myHTML = fs.readFileSync("./index.html", "utf8");

@Injectable()
export class Generate2FAService {
  constructor(private readonly mailerService: MailerService, private prisma: PrismaService) {}

  async generateService(@Req() req: Request, @Res() res: Response) {
    const accessToken = req.cookies.access_token;
    const user = await this.prisma.user.findFirst({
      where: {
        auth: {
          accessToken: accessToken,
        },
      },
      include: {
        auth: true,
      },
    });
    this.updateUser(user);
    return user;
  }

  async updateUser(user: (User & { auth: Auth | null }) | null) {
    try {
      const userid = user?.id;
      const updatedUser = await this.prisma.user.update({
        where: { id: userid },
        data: {
          auth: {
            update: {
              twoFAactivated: true,
              otp_validated: false,
            },
          },
        },
        include: {
          auth: true,
        },
      });
      return updatedUser;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: "Fail to update user in Generate 2FA ",
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async sendActivationMail(user42: any) {
    try {
      const email = user42.auth.email;
      const code2FA = this.generateRandomCode(6);
      this.sendEmailToUser(email, user42, code2FA);
      await this.storeCodeToDataBase(code2FA, user42);
      this.updateUser(user42);
      return code2FA;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: "Invalid email",
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  generateRandomCode(length: number): string {
    let result = "";
    const characters = "0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async sendEmailToUser(email: string, user42: any, code2FA: string) {
    let htmlWithCode = myHTML.replace("{{code2FA}}", code2FA);
    htmlWithCode = htmlWithCode.replace("{{userName}}", user42.name);

    this.mailerService.sendMail({
      to: `${email}`,
      from: "wallE.transcendence@gmail.com",
      subject: "Wall-E: Your confirmation code",
      text: "transcendence !",
      html: htmlWithCode,
    });
  }

  async storeCodeToDataBase(code2FA: string, user42: any) {
    try {
      const userid = user42.id;
      const updatedUser = await this.prisma.user.update({
        where: { id: userid },
        data: {
          auth: {
            update: {
              twoFASecret: code2FA,
            },
          },
        },
        include: {
          auth: true,
        },
      });
      return updatedUser;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: "Error to store secret in database",
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
