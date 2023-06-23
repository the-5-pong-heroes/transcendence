import { PrismaService } from "../../database/prisma.service";
import { Request } from "express";
import { BadRequestException, Injectable, Req } from "@nestjs/common";
import { TwoFA } from "../interface";

@Injectable()
export class EnableService {
  constructor(private readonly prisma: PrismaService) {}

  async disable2FA(@Req() req: Request): Promise<void> {
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

  async status2FA(@Req() req: Request): Promise<TwoFA> {
    try {
      const accessToken = req.signedCookies.access_token;
      if (!accessToken) {
        return { twoFA: false };
      }
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
