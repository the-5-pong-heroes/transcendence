import { Injectable, Req, Res, HttpStatus } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { Request, Response } from "express";
import { UserWithAuth } from "src/common/@types";

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
      if (code === user.auth?.twoFASecret) {
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
        return res.status(HttpStatus.OK).json({ message: "2FA verified", user: user });
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "2FA code is not valid", user: null });
      }
    }
  }

  async updateVerify2FA(user: UserWithAuth) {
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
