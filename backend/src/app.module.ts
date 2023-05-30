import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
//import { UserModule } from "./api/users/users.module.ts";
import { UserModule } from "./user/user.module";
//import { UsersModule } from "./users_paul/users.module"; // TEMPORAIRE
import { GameApiModule, GameSocketModule } from "./game";
import { StatsModule } from "./stats/stats.module";
import { AuthModule } from "./auth/auth.module";
//import { AuthModule } from "./auth_paul/auth.module"; // TEMPORAIRE
import { ChannelsModule } from "./channels/channels.module";
import { PrismaModule } from "./database/prisma.module";
import { GoogleStrategy } from "./auth/google/google.strategy";
//import { UserModule } from "./users/users.module"
import { PrismaService } from "./database/prisma.service";
import { APP_FILTER } from "@nestjs/core";

@Module({
  imports: [
    StatsModule,
    AuthModule,
    GameSocketModule,
    UserModule,
    //UsersModule, // TEMPORAIRE
    GameApiModule,
    ChannelsModule,
    PrismaModule,
    //ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy, PrismaService],
})
export class AppModule {}
