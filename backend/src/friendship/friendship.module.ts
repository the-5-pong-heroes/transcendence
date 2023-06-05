import { Module } from "@nestjs/common";
import { FriendshipService } from "./friendship.service";
import { FriendshipController } from "./friendship.controller";
import { UsersService } from "../users_paul/users.service";

@Module({
  controllers: [FriendshipController],
  providers: [FriendshipService, UsersService],
})
export class FriendshipModule {}
