import { Module } from "@nestjs/common";
import { PrismaModule } from "src/database/prisma.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { Oauth42Service } from "./auth42/Oauth42.service";
import { GoogleStrategy } from "./google/google.strategy";


@Module({
    imports: [PrismaModule],
    controllers: [AuthController],
    providers: [GoogleStrategy, AuthService, Oauth42Service],
})
export class AuthModule {}
