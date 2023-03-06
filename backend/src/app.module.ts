import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { GameModule } from "./game/game.module";
import { StatsModule } from "./stats/stats.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [GameModule, StatsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
