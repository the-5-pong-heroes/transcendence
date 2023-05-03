import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
//import { GameModule } from "./game/game.module";
import { StatsModule } from "./stats/stats.module";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./database/prisma.module";
import { GoogleStrategy } from "./auth/google/google.strategy";
import { UserModule } from "./users/users.module"
import { PrismaService } from "./database/prisma.service";
import { APP_FILTER } from "@nestjs/core";

@Module({
  imports: [UserModule, StatsModule, AuthModule, PrismaModule, ConfigModule.forRoot({isGlobal: true}),],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy, PrismaService],
})
export class AppModule {}
