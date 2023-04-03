import { Module } from "@nestjs/common";
import { GameService } from "./game.service";
import { GameController } from "./game.controller";
import { PrismaModule } from "src/database/prisma.module";

@Module({
  imports: [PrismaModule],
  providers: [GameService],
  controllers: [GameController],
  exports: [GameService],
})
export class GameApiModule {}
