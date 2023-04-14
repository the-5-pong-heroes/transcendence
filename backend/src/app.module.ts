import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
//import { UserModule } from "./api/users/users.module.ts";
import { UserModule } from "./user/user.module";
import { GameApiModule, GameSocketModule } from "./game";
import { StatsModule } from "./stats/stats.module";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./database/prisma.module";
import { GoogleStrategy } from "./auth/google/google.strategy";

@Module({
  imports: [
    StatsModule,
    AuthModule,
    GameSocketModule,
    UserModule,
    GameApiModule,
    PrismaModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy],
})
export class AppModule {}
