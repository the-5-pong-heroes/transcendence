import { Module } from "@nestjs/common";
import { FriendshipService } from "./friendship.service";
import { FriendshipController } from "./friendship.controller";
import { UsersService } from "../users_paul/users.service";
import { UserGuard } from "src/auth/user.guard";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [FriendshipController],
  providers: [FriendshipService, UsersService, UserGuard],
})
export class FriendshipModule {}
