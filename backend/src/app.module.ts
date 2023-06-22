import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
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
import { CurrentUserMiddleware } from "./common/middleware/current-user.middleware";
import { PrismaService } from "./database/prisma.service";
import { AUTH_EXEMPT_ROUTES } from "./common/constants/auth";
import { validate } from "./env.validation";

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
    ConfigModule.forRoot({
      validate, // checks that no env var is missing or invalid
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // registers our custom middleware, that attaches the current user to each of its request
    consumer
      .apply(CurrentUserMiddleware)
      .exclude({ path: AUTH_EXEMPT_ROUTES, method: RequestMethod.ALL })
      .forRoutes("*");
  }
}
