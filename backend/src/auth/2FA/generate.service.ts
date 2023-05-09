import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { PrismaService } from '../../database/prisma.service';
import { Request, Response } from 'express';
import { HttpException, HttpStatus, Injectable, Req, Res } from '@nestjs/common';
import { Auth } from '@prisma/client';

@Injectable()
export class GenerateService {
  constructor(private readonly prisma: PrismaService) {}

  async GenerateService(@Req() req: Request, @Res() res: Response) {
    try {
      const { userId } = req.user as { userId: string };
      const auth = await this.prisma.auth.findUnique({
        where: {
          userId,
        },
      });

      if (!auth) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Auth not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      if (auth.otp_activated) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'OTP already activated',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const secret = speakeasy.generateSecret({
        length: 20,
        name: 'Transcendance',
      });

      const otpAuthUrl = speakeasy.otpauthURL({
        secret: secret.base32,
        label: 'Transcendance',
        issuer: 'Transcendance',
      });

      const qrcodeUrl = await qrcode.toDataURL(otpAuthUrl);

      const updatedAuth = await this.updateAuth(userId, secret.base32);

      res.status(HttpStatus.OK).json({
        otpAuthUrl,
        qrcodeUrl,
        auth: updatedAuth,
      });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Error generating OTP',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateAuth(userId: string, secret: string): Promise<Auth> {
    try {
      const updatedAuth = await this.prisma.auth.update({
        where: {
          userId,
        },
        data: {
          otp_activated: true,
          otp_secret: secret,
        },
      });
      return updatedAuth;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Failed to update auth',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
