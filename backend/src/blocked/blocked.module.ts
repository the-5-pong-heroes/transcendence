import { Module } from "@nestjs/common";
import { BlockedService } from "./blocked.service";
import { BlockedController } from "./blocked.controller";
import { UsersService } from "src/users_paul/users.service";

@Module({
  controllers: [BlockedController],
  providers: [BlockedService, UsersService],
})
export class BlockedModule {}
