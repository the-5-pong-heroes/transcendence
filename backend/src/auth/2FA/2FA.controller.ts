import {Controller, Get, Post, Req, Res} from '@nestjs/common';
import {Request, Response} from 'express';
import {EnableService} from './enable2FA.service';
import {2FAGenerateService} from './generate.service';
import {2FAValidateService} from './verify.service';

@Controller('2FA')
export class my2FAController {
	constructor(
		private readonly generate2FA: Mail2FaGenerateService,
		private readonly validate2FA: Mail2FaValidateService,
		private readonly disable2FA: EnableService
	) {}

	@Post('sendEmail')
	async SendMail(@Req() req: Request, @Res() res: Response): Promise<void> {
		await this.generate2FA.sendActivationMail(req, res);
	}

	@Post('verify')
	async VerifyMail(@Req() req: Request, @Res() res: Response): Promise<void> {
		await this.validate2FA.validate2FA(req, res);
	}

	@Post('disable')
	async Disable(@Req() req: Request, @Res() res: Response): Promise<void> {
		await this.disable2FA.disable2FA(req, res);
	}
}