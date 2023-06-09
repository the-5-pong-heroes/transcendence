import { UserService } from "src/users/users.service";
import { Generate2FAService } from "./2FA/generate.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { EnableService } from "./2FA/enable2FA.service";
import { VerifyService } from "./2FA/verify.service";
import { Module, forwardRef } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./strategy/local.strategy";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { Oauth42Service } from "./auth42/Oauth42.service";
import { GoogleStrategy } from "./google/google.strategy";
import { GoogleService } from "./google/google.service";
import { PrismaModule } from "src/database/prisma.module";
import { UserGuard } from "./user.guard";
import { UserModule } from "src/users/users.module";

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.register({
      secret: "secret",
      signOptions: { expiresIn: "1d" },
    }),
    MailerModule.forRoot({
      transport: {
        port: 465,
        host: "smtp.gmail.com",
        auth: {
          user: "wallE.transcendence@gmail.com",
          pass: "fsyuokyiumczzmdb",
        },
      },
    }),
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [
    GoogleStrategy,
    GoogleService,
    AuthService,
    Oauth42Service,
    UserService,
    Generate2FAService,
    EnableService,
    VerifyService,
    LocalStrategy,
    JwtStrategy,
    UserGuard,
  ],
  exports: [AuthService, UserGuard],
})
export class AuthModule {}
