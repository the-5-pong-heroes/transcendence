import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { BlockedService } from "./blocked.service";

@Controller("blocked")
@UseGuards(AuthGuard("jwt"))
export class BlockedController {
  constructor(private readonly blockedService: BlockedService) {}

  @Post()
  create(@Body() data: any, @Req() req: any) {
    if (data.toBlock) this.blockedService.create({ blockedUserId: data.blockedUserId, userId: req.user.userId });
    else this.blockedService.delete({ blockedUserId: data.blockedUserId, userId: req.user.userId });
  }
}
