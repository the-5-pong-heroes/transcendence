import { Body, Controller, Delete, Post, Req, UseGuards } from "@nestjs/common";
import { FriendshipService } from "./friendship.service";
import { UserGuard } from "src/auth/user.guard";

@Controller("friendship")
@UseGuards(UserGuard)
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Post()
  create(@Body() data: any, @Req() req: any) {
    this.friendshipService.create(data, req.user);
  }

  @Delete()
  delete(@Body() data: any, @Req() req: any) {
    this.friendshipService.delete(data, req.user);
  }
}
