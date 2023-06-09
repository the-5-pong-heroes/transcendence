import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { GameModule } from "./game/game.module";
import { StatsModule } from "./stats/stats.module";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./database/prisma.module";
import { ChannelsModule } from "./channels/channels.module";
import { UserSettingsModule } from "./user-settings/user-settings.module";
import { FriendshipModule } from "./friendship/friendship.module";
import { BlockedModule } from "./blocked/blocked.module";
import { PrismaService } from "./database/prisma.service";
import { GoogleStrategy } from "./auth/google/google.strategy";

@Module({
  imports: [
    StatsModule,
    AuthModule,
    GameModule,
    ChannelsModule,
    UserModule,
    ChannelsModule,
    UserSettingsModule,
    FriendshipModule,
    BlockedModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy, PrismaService],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  // registers our custom middleware, that attaches the current user to each of its request
  //consumer.apply(CurrentUserMiddleware).forRoutes("*");
  // }
}
