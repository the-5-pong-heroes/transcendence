import { Body, Controller, Delete, Post, Req } from "@nestjs/common";
import { FriendshipService } from "./friendship.service";

@Controller("friendship")
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Post()
  create(@Body() data: any, @Req() req: any) {
    this.friendshipService.create(data, req.currentUser);
  }

  @Delete()
  delete(@Body() data: any, @Req() req: any) {
    this.friendshipService.delete(data, req.currentUser);
  }
}
