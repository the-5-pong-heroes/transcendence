import { Module } from "@nestjs/common";
import { GameGateway } from "./game.gateway";
import { GameLobbyService } from "./game-lobby.service";
import { GameApiModule } from "../game-api/game-api.module";

@Module({
  imports: [GameApiModule],
  providers: [GameGateway, GameLobbyService],
})
export class GameSocketModule {}
