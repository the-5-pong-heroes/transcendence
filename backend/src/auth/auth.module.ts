import { UserService } from "src/user/user.service";
import { Generate2FAService } from "./2FA/generate.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { EnableService } from "./2FA/enable2FA.service";
import { VerifyService } from "./2FA/verify.service";
import { Module, forwardRef } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { Oauth42Service } from "./auth42/Oauth42.service";

import { PrismaModule } from "src/database/prisma.module";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    MailerModule.forRoot({
      transport: {
        port: 465,
        host: "smtp.gmail.com",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASSWORD,
        },
      },
    }),
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, Oauth42Service, UserService, Generate2FAService, EnableService, VerifyService],
  exports: [AuthService],
})
export class AuthModule {}
