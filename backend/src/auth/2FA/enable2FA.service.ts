import { PrismaService } from "../../database/prisma.service";
import { Request, Response } from "express";
import { HttpException, HttpStatus, Injectable, Req, Res } from "@nestjs/common";

@Injectable()
export class EnableService {
  constructor(private readonly prisma: PrismaService) {}

  async disable2FA(@Req() req: Request, @Res() res: Response) {
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
    return user;
  }

  async eable2FA(@Req() req: Request, @Res() res: Response) {
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
}
