import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
//import { UserModule } from "./api/users/users.module.ts";
//import { GameModule } from "./game/game.module";
import { StatsModule } from "./stats/stats.module";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./database/prisma.module";

@Module({
  imports: [StatsModule, AuthModule, PrismaModule, ConfigModule.forRoot({isGlobal: true}),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
