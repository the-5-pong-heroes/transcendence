import { Module } from "@nestjs/common";
import { BlockedService } from "./blocked.service";
import { BlockedController } from "./blocked.controller";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [BlockedController],
  providers: [BlockedService],
})
export class BlockedModule {}
