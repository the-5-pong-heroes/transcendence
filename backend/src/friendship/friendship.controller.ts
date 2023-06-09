import { Body, Controller, Delete, Post, Req, UseGuards } from "@nestjs/common";
// import { AuthGuard } from "@nestjs/passport";
import { FriendshipService } from "./friendship.service";
import { UserGuard } from "src/auth/user.guard";

@Controller("friendship")
// @UseGuards(UserGuard)
// @UseGuards(AuthGuard("jwt"))
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Post()
  create(@Body() data: any, @Req() req: any) {
    console.log("🏓", data);
    this.friendshipService.create(data, req.user);
  }

  @Delete()
  delete(@Body() data: any, @Req() req: any) {
    this.friendshipService.delete(data, req.user);
  }
}
