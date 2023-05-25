import { Module } from "@nestjs/common";
import { PrismaModule } from "src/database/prisma.module";
import { UserService } from "src/users/users.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { Oauth42Service } from "./auth42/Oauth42.service";
import { Generate2FAService } from "./2FA/generate.service";
import { GoogleStrategy } from "./google/google.strategy";
import { GoogleService } from "./google/google.service";
import {MailerModule} from '@nestjs-modules/mailer';
import { EnableService } from "./2FA/enable2FA.service";


@Module({
    imports: [
        MailerModule.forRoot({
			transport: {
				port: 465,
				host: 'smtp.gmail.com',
				auth: {
					user: 'wallE.transcendence@gmail.com',
					pass: 'my_password',
				},
			},
		}),
        PrismaModule],
    controllers: [AuthController],
    providers: [GoogleStrategy, GoogleService, AuthService, Oauth42Service, UserService, Generate2FAService, EnableService],
})
export class AuthModule {}
