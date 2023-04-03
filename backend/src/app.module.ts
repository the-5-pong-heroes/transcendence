import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { GameApiModule, GameSocketModule } from "./game";
import { PrismaModule } from "./database/prisma.module";
import { UserModule } from './user/user.module';

@Module({
  imports: [PrismaModule, UserModule, GameApiModule, GameSocketModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
