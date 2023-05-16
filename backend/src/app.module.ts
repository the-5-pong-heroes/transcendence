import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
//import { UserModule } from "./api/users/users.module.ts";
import { UserModule } from "./user/user.module";
import { GameModule } from "./game/game.module";
// import { WebsocketModule } from "./websocket/websocket.module";
import { StatsModule } from "./stats/stats.module";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./database/prisma.module";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    StatsModule,
    AuthModule,
    // WebsocketModule,
    GameModule,
    UserModule,
    PrismaModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
