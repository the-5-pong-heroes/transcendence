import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./strategy/local.strategy";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { UsersModule } from "../users/users.module";
import { Oauth42Service } from "./auth42/Oauth42.service";
import { GoogleStrategy } from "./google/google.strategy";
import { GoogleService } from "./google/google.service";
import { PrismaModule } from "src/database/prisma.module";
import { UsersService } from "src/users/users.service";
import { UserGuard } from "./user.guard";

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: "secret",
      signOptions: { expiresIn: "1d" },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    GoogleService,
    Oauth42Service,
    UsersService,
    UserGuard,
  ],
  exports: [AuthService, UserGuard],
})
export class AuthModule {}
