import { Module } from "@nestjs/common";
import { GameGateway } from "./game.gateway";
import { GameService } from "./game.service";
import { PrismaModule } from "../database/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "src/user/user.module";
import { WsGuard } from "./ws.guard";

@Module({
  imports: [PrismaModule, UserModule, JwtModule],
  providers: [GameGateway, GameService, WsGuard],
})
export class GameModule {}
