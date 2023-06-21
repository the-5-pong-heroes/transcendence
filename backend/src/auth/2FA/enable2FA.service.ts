import { PrismaService } from "../../database/prisma.service";
import { Request, Response } from "express";
import { BadRequestException, Injectable, Req, Res } from "@nestjs/common";

@Injectable()
export class EnableService {
  constructor(private readonly prisma: PrismaService) {}

  async disable2FA(@Req() req: Request) {
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
    if (user) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          auth: {
            update: {
              twoFAactivated: false,
              otp_validated: false,
            },
          },
        },
      });
    }
  }

  async eable2FA(@Req() req: Request) {
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
    if (user) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          auth: {
            update: {
              twoFAactivated: true,
              otp_validated: false,
            },
          },
        },
      });
    }
    return user;
  }

  async status2FA(@Req() req: Request) {
    try {
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
      if (user) {
        if (user.auth?.twoFAactivated === true) return { twoFA: true };
      }
      return { twoFA: false };
    } catch (error) {
      throw new BadRequestException("Status 2FA not updated");
    }
  }
}
