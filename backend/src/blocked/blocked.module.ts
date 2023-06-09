import { Module } from "@nestjs/common";
import { BlockedService } from "./blocked.service";
import { BlockedController } from "./blocked.controller";
// import { userService } from "src/users_paul/users.service";
import { userService } from "src/user/users.service";
import { UserGuard } from "src/auth/user.guard";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [BlockedController],
  providers: [BlockedService, userService, UserGuard],
})
export class BlockedModule {}
