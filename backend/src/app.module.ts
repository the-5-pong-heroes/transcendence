import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { GameApiModule, GameSocketModule } from "./game";
import { PrismaModule } from "./database/prisma.module";
import { UserModule } from "./user/user.module";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [PrismaModule, UserModule, ScheduleModule.forRoot(), GameApiModule, GameSocketModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
