import { Module } from "@nestjs/common";
import { PrismaModule } from "src/database/prisma.module";
import { UserService } from "src/users/users.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { Oauth42Service } from "./auth42/Oauth42.service";
import { GoogleStrategy } from "./google/google.strategy";
import { GoogleService } from "./google/google.service";


@Module({
    imports: [PrismaModule],
    controllers: [AuthController],
    providers: [GoogleStrategy, GoogleService, AuthService, Oauth42Service, UserService],
})
export class AuthModule {}