import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { GameModule } from "./game/game.module";
import { StatsModule } from "./stats/stats.module";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./database/prisma.module";
import { ChannelsModule } from "./channels/channels.module";
import { UserSettingsModule } from "./user-settings/user-settings.module";
import { FriendshipModule } from "./friendship/friendship.module";
import { BlockedModule } from "./blocked/blocked.module";

@Module({
  imports: [
    StatsModule,
    AuthModule,
    GameModule,
    ChannelsModule,
    UsersModule,
    ChannelsModule,
    UserSettingsModule,
    FriendshipModule,
    BlockedModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
