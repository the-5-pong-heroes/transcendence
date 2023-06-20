import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { BlockedService } from "./blocked.service";
import { UserGuard } from "src/auth/user.guard";

@Controller("blocked")
@UseGuards(UserGuard)
export class BlockedController {
  constructor(private readonly blockedService: BlockedService) {}

  @Post()
  create(@Body() data: any, @Req() req: any) {
    if (data.toBlock) this.blockedService.create({ blockedUserId: data.blockedUserId, userId: req.user.id });
    else this.blockedService.delete({ blockedUserId: data.blockedUserId, userId: req.user.id });
  }
}
