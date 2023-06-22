import { Module } from "@nestjs/common";
import { FriendshipService } from "./friendship.service";
import { FriendshipController } from "./friendship.controller";
import { UserService } from "../user/user.service";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [FriendshipController],
  providers: [FriendshipService, UserService],
})
export class FriendshipModule {}
