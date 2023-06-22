import { Body, Controller, Put, Post, Req } from "@nestjs/common";
import { FriendshipService } from "./friendship.service";
import { CurrentUser } from "src/common/decorators";
import { User } from "@prisma/client";
import { AddFriendDto, DeleteFriendDto } from "./dto";

@Controller("friendship")
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() data: AddFriendDto) {
    this.friendshipService.create(user, data.newFriendId);
  }

  @Put()
  delete(@CurrentUser() user: User, @Body() data: DeleteFriendDto) {
    this.friendshipService.delete(user, data.friendId);
  }
}
