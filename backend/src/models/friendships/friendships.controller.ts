import { Controller, Get, Post, Body, Param, Delete, ParseUUIDPipe } from "@nestjs/common";
import { FriendshipsService } from "./friendships.service";
import { AddFriendDto } from "./add-friend.dto";

@Controller("friendships")
export class FriendshipsController {
  constructor(private readonly friendshipsService: FriendshipsService) {}

  @Post()
  create(@Body() addFriendDto: AddFriendDto) {
    return this.friendshipsService.create(addFriendDto);
  }

  @Get()
  findAll() {
    return this.friendshipsService.findAll();
  }

  @Get(":uuid")
  async findOne(@Param("uuid", ParseUUIDPipe) uuid: string) {
    return this.friendshipsService.findOne(uuid);
  }

  // no 'update' route since users can only add or remove friends

  @Delete(":uuid")
  remove(@Param("uuid", ParseUUIDPipe) uuid: string) {
    return this.friendshipsService.remove(uuid);
  }
}
