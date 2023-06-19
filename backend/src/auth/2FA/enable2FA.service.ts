import { PrismaService } from "../../database/prisma.service";
import { Request, Response } from "express";
import { Injectable, Req, Res } from "@nestjs/common";

@Injectable()
export class EnableService {
  constructor(private readonly prisma: PrismaService) {}

  async disable2FA(@Req() req: Request, @Res() res: Response) {
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
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          auth: {
            update: {
              twoFAactivated: false,
            },
          },
        },
      });
    }
    return user;
  }
}
