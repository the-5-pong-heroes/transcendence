import { MailerService } from '@nestjs-modules/mailer';
import { Catch, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

const myHTML = fs.readFileSync("./index.html", "utf8");


@Injectable()
export class Generate2FAService {
	constructor(private readonly mailerService : MailerService,
		private prisma: PrismaService) {}

/* SEND 2FA ACTIVATION EMAIL in settings page */
	async sendActivationMail(user42: any)
	{
		try {
			const email = user42.email;
			const code2FA = this.generateRandomCode(6);
			this.sendEmailToUser(email, user42, code2FA);
			await this.storeCodeToDataBase(code2FA, user42)
		// 	res.status(200).json({
		// 		email,
		// });
		}
		catch(e) {
		throw new HttpException({
			status: HttpStatus.BAD_REQUEST,
			error: "Invalid email"},
			 HttpStatus.BAD_REQUEST);
		}
	}
		// update the database and hash the passwor

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
			const { userName } = user42.name;
			await this.prisma.user.update({
				where: { name:  userName}, // to change by the id/name of the request
				data: {//
				},
			})
		} catch(error) {
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: "Error to store email in database"},
				HttpStatus.BAD_REQUEST);
		}
	}
}

