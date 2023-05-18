import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
//import { UserModule } from "./api/users/users.module.ts";
//import { UserModule } from "./user/user.module";
import { UsersModule } from "./users_paul/users.module"; // TEMPORAIRE
import { GameApiModule, GameSocketModule } from "./game";
import { StatsModule } from "./stats/stats.module";
//import { AuthModule } from "./auth/auth.module";
import { AuthModule } from "./auth_paul/auth.module"; // TEMPORAIRE
import { ChannelsModule } from "./channels/channels.module";
import { UserSettingsModule } from "./user-settings/user-settings.module";
import { PrismaModule } from "./database/prisma.module";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    StatsModule,
    AuthModule,
    GameSocketModule,
    //UserModule,
    UsersModule, // TEMPORAIRE
    GameApiModule,
    ChannelsModule,
    UserSettingsModule,
    PrismaModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
