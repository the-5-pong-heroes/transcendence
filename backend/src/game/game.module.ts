import { Module } from "@nestjs/common";

import { GameGateway } from "./game.gateway";
import { GameService } from "./game.service";
import { PrismaModule } from "../database/prisma.module";
import { AuthModule } from "src/auth/auth.module";
import { UserModule } from "src/user/user.module";
import { WebSocketInterceptor } from "src/common/interceptors";

@Module({
  imports: [PrismaModule, UserModule, AuthModule],
  providers: [GameGateway, GameService, WebSocketInterceptor],
})
export class GameModule {}
