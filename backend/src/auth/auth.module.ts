import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./strategy/local.strategy";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { UserModule } from "../user/user.module";
import { Oauth42Service } from "./auth42/Oauth42.service";
import { GoogleStrategy } from "./google/google.strategy";
import { GoogleService } from "./google/google.service";
import { PrismaModule } from "src/database/prisma.module";
import { UserService } from "src/user/user.service";

@Module({
  imports: [
    PrismaModule,
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: "secret",
      signOptions: { expiresIn: "1d" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy, GoogleService, Oauth42Service, UserService],
  exports: [AuthService],
})
export class AuthModule {}
