import { Module } from "@nestjs/common";
import { FriendshipService } from "./friendship.service";
import { FriendshipController } from "./friendship.controller";
import { UserService } from "../user/user.service";
import { UserGuard } from "src/auth/user.guard";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [FriendshipController],
  providers: [FriendshipService, UserService, UserGuard],
})
export class FriendshipModule {}
