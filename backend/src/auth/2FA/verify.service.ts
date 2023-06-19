import { Injectable, Req, Res } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { Request, Response } from "express";
import { User } from "@prisma/client";

@Injectable()
export class VerifyService {
  constructor(private readonly prisma: PrismaService) {}

  async validate2FA(@Req() req: Request, @Res() res: Response, code: string) {
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
    console.log("🔐", user?.auth?.twoFASecret);
    if (code !== user?.auth?.twoFASecret) {
      return res.status(400).json({ message: "Invalid code !", user: null });
    }
    if (user) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          auth: {
            update: {
              otp_verified: true,
            },
          },
        },
      });
    }
    console.log("✨ validate2FA: ");
    res.status(200).json({ message: "Welcome !", user: user });
  }

  // async validate2FA(@Req() req: Request, @Res() res: Response) {
  //   const accessToken = req.signedCookies.access_token;
  //   const user = await this.prisma.user.findFirst({
  //     where: {
  //       auth: {
  //         accessToken: accessToken,
  //       },
  //     },
  //     include: {
  //       auth: true,
  //     },
  //   });
  //   if (user) {
  //     await this.prisma.user.update({
  //       where: { id: user.id },
  //       data: {
  //         auth: {
  //           update: {
  //             otp_verified: true,
  //           },
  //         },
  //       },
  //     });
  //   }
  //   res.status(200).json({ message: "Welcome !", user: user });
  // }

  async updateVerify2FA(user: User) {
    if (user) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          auth: {
            update: {
              otp_verified: false,
            },
          },
        },
      });
    }
    return user;
  }
}
