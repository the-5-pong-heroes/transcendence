import { PrismaService } from "../../database/prisma.service";
import { Request, Response } from "express";
import { HttpException, HttpStatus, Injectable, Req, Res } from '@nestjs/common';
import * as speakeasy from 'speakeasy';

@Injectable()
export class VerifyService {
	constructor(private readonly prisma: PrismaService) {}

	async verifyCode(@Req() req: Request, @Res() res: Response) {
		try {
			const { userName, token } = req.body;
			const auth = await this.prisma.auth.findUnique({
				where: { email: userName }
			});

			if (!auth) {
				throw new HttpException({
					status: HttpStatus.NOT_FOUND,
					error: "User not found"
				}, HttpStatus.NOT_FOUND);
			}

			if (!auth.otp_activated) {
				throw new HttpException({
					status: HttpStatus.BAD_REQUEST,
					error: "OTP not activated"
				}, HttpStatus.BAD_REQUEST);
			}

			const secret = auth.password;
			const verified = speakeasy.totp.verify({
				secret: secret,
				encoding: 'base32',
				token: token,
				window: 1
			});

			if (verified) {
				await this.updateAuth(userName, true, true);
				return res.status(200).json({
					message: "Verification successful"
				});
			} else {
				return res.status(400).json({
					error: "Invalid code"
				});
			}
		} catch (error) {
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: "Failed to verify OTP"
			}, HttpStatus.BAD_REQUEST);
		}
	}

	async updateAuth(email: string, otp_verified: boolean, otp_validated: boolean) {
		try {
			await this.prisma.auth.update({
				where: { email },
				data: { otp_verified, otp_validated }
			});
		} catch (error) {
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: "Failed to update OTP status"
			}, HttpStatus.BAD_REQUEST);
		}
	}
}
