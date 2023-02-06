import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameGateway } from './game/game.gateway';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [StatsModule],
  controllers: [AppController],
  providers: [AppService, GameGateway],
})
export class AppModule {}
