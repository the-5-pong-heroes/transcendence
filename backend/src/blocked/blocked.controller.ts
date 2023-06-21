import { Body, Controller, Post, Req } from "@nestjs/common";
import { BlockedService } from "./blocked.service";

@Controller("blocked")
export class BlockedController {
  constructor(private readonly blockedService: BlockedService) {}

  @Post()
  create(@Body() data: any, @Req() req: any) {
    if (data.toBlock) this.blockedService.create({ blockedUserId: data.blockedUserId, userId: req.currentUser.id });
    else this.blockedService.delete({ blockedUserId: data.blockedUserId, userId: req.currentUser.id });
  }
}
