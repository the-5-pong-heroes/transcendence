import { Body, Controller, Post } from "@nestjs/common";
import { BlockedService } from "./blocked.service";
import { CurrentUser } from "src/common/decorators";
import { User } from "@prisma/client";
import { BlockedUserDto } from "./dto/blocked-user.dto";

@Controller("blocked")
export class BlockedController {
  constructor(private readonly blockedService: BlockedService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() data: BlockedUserDto) {
    if (data.toBlock) this.blockedService.create({ blockedUserId: data.blockedUserId, userId: user.id });
    else this.blockedService.delete({ blockedUserId: data.blockedUserId, userId: user.id });
  }
}
