import { MailerService } from "@nestjs-modules/mailer";
import { BadRequestException, Injectable, Req } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import * as fs from "fs";
import { Request } from "express";
import { UserWithAuth } from "src/common/@types";

const myHTML = fs.readFileSync("./index.html", "utf8");

@Injectable()
export class Generate2FAService {
  constructor(private readonly mailerService: MailerService, private prisma: PrismaService) {}

  async generateService(@Req() req: Request): Promise<void> {
    const accessToken = req.signedCookies.access_token;
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
  }

  async updateUser(user: UserWithAuth | null): Promise<UserWithAuth> {
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
      throw new BadRequestException("Fail to update user in Generate 2FA");
    }
  }

  async sendActivationMail(user: UserWithAuth): Promise<void> {
    if (!user.auth) {
      return;
    }
    try {
      const email = user.auth.email;
      const code2FA = this.generateRandomCode(6);
      this.sendEmailToUser(email, user, code2FA);
      await this.storeCodeToDataBase(code2FA, user);
      this.updateUser(user);
    } catch (error) {
      throw new BadRequestException("Invalid email");
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

  async sendEmailToUser(email: string, user: UserWithAuth, code2FA: string): Promise<void> {
    let htmlWithCode = myHTML.replace("{{code2FA}}", code2FA);
    htmlWithCode = htmlWithCode.replace("{{userName}}", user.name);

    this.mailerService.sendMail({
      to: `${email}`,
      from: "wallE.transcendence@gmail.com",
      subject: "Wall-E: Your confirmation code",
      text: "transcendence !",
      html: htmlWithCode,
    });
  }

  async storeCodeToDataBase(code2FA: string, user: UserWithAuth): Promise<UserWithAuth> {
    try {
      const userid = user.id;
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
      throw new BadRequestException("Error to store secret in database");
    }
  }
}
