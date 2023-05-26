import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable, Req, Res } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import { Request, Response } from "express";

const myHTML = fs.readFileSync("./index.html", "utf8");


@Injectable()
export class Generate2FAService {
	constructor(private readonly mailerService : MailerService,
		private prisma: PrismaService) {}

	async generateService(@Req() req: Request, @Res() res: Response)
	{
		console.log("in generate");
		const accessToken = req.cookies.token;
        const user = await this.prisma.user.findFirst({
          where: {
              auth: {
                accessToken: accessToken,
              }
            },
			include: {
				auth: true,
			  },
            });
		if (user?.auth?.twoFAactivated == true)
		{
			await this.sendActivationMail(user);			
			return res.json({
				user,
			});
		}
	}
	

	async sendActivationMail(user42: any)
	{
		try {
			const email = user42.auth.email;
			const code2FA = this.generateRandomCode(6);
			console.log("sending to ", email);
			this.sendEmailToUser(email, user42, code2FA);
			await this.storeCodeToDataBase(code2FA, user42)
		}
		catch(error) { 
		throw new HttpException({
			status: HttpStatus.BAD_REQUEST,
			error: "Invalid email"},
			 HttpStatus.BAD_REQUEST);
		}
	}

	generateRandomCode(length: number): string {
		let result = '';
		const characters = '0123456789';
		const charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
		  result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	  }

	async sendEmailToUser(email: string, user42: any, code2FA: string) {
		console.log("code2FA =", code2FA);
		console.log("username = ", user42.name);
		let htmlWithCode = myHTML.replace('{{code2FA}}', code2FA);
  		htmlWithCode = htmlWithCode.replace('{{userName}}', user42.name);

		this.mailerService.sendMail({
			to: `${email}`,
			from: 'wallE.transcendence@gmail.com',
			subject: 'Wall-E: Your confirmation code',
			text:'transcendence !',
			html: htmlWithCode,
		})
	}

	async storeCodeToDataBase(code2FA: string, user42: any)
	{
		try {
			const saltOrRounds = 10;
			const password = code2FA;
			const hash = await bcrypt.hash(password, saltOrRounds);
			await this.prisma.auth.update({
				where: { userId:  user42.id}, // to change by the id/name of the request
				data: {
					twoFASecret: hash,
				},
			})
		} catch(error) {
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: "Error to store secret in database"},
				HttpStatus.BAD_REQUEST);
		}
	}
}

