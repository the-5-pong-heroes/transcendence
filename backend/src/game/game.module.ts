import { Module } from "@nestjs/common";

import { GameGateway } from "./game.gateway";
import { GameService } from "./game.service";
import { PrismaModule } from "../database/prisma.module";
import { AuthModule } from "src/auth/auth.module";
import { UsersModule } from "src/users/users.module";
import { WsGuard } from "./ws.guard";

@Module({
  imports: [PrismaModule, UsersModule, AuthModule],
  providers: [GameGateway, GameService, WsGuard],
})
export class GameModule {}
