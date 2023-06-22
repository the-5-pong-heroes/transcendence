import { Injectable, Req, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { Request } from "express";
import { UserWithAuth } from "src/common/@types";

@Injectable()
export class VerifyService {
  constructor(private readonly prisma: PrismaService) {}

  async validate2FA(@Req() req: Request, code: string): Promise<UserWithAuth> {
    const accessToken = req.signedCookies.access_token;
    const user = await this.prisma.user.findFirstOrThrow({
      where: {
        auth: {
          accessToken: accessToken,
        },
      },
      include: {
        auth: true,
      },
    });
    if (code !== user.auth?.twoFASecret) {
      throw new BadRequestException("2FA code is not valid");
    }
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
    return user;
  }

  async updateVerify2FA(user: UserWithAuth): Promise<UserWithAuth> {
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
