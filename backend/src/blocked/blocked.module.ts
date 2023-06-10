import { Module } from "@nestjs/common";
import { BlockedService } from "./blocked.service";
import { BlockedController } from "./blocked.controller";
import { UserService } from "src/user/user.service";
import { UserGuard } from "src/auth/user.guard";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [BlockedController],
  providers: [BlockedService, UserService, UserGuard],
})
export class BlockedModule {}
