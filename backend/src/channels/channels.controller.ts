import { Controller, Get, Post, Body, Param, Put, BadRequestException, UnauthorizedException } from "@nestjs/common";
import { ChannelUser } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";
import { MessagesService } from "../messages/messages.service";
import { ChannelsService } from "./channels.service";
import { CreateChannelDto } from "./dto/create-channel.dto";
import { UpdateChannelDto } from "./dto/update-channel.dto";
import { CurrentUser } from "src/common/decorators";
import { User } from "@prisma/client";

@Controller("chat")
export class ChannelsController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly channelsService: ChannelsService,
    private readonly messageService: MessagesService,
  ) {}

  @Post()
  createChannel(@Body() createChannelDto: CreateChannelDto) {
    return this.channelsService.create(createChannelDto);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.channelsService.findAll(user.id);
  }

  @Get(":id")
  findMessages(@Param("id") id: string) {
    return this.messageService.findAll(id);
  }

  @Get("search/:name")
  searchChannels(@Param("name") name: string, @CurrentUser() user: User) {
    return this.channelsService.searchAll({
      channelName: name,
      userId: user.id,
    });
  }

  @Put(":id")
  async update(@Param("id") id: string, @CurrentUser() currentUser: User, @Body() updateChannelDto: UpdateChannelDto) {
    if (id != updateChannelDto.id) throw new BadRequestException("Wrong Channel");
    const user = await this.prismaService.user.findUnique({
      where: { id: currentUser.id },
    });
    const channel = await this.channelsService.findOne(updateChannelDto.id);
    if (
      !channel.users.some((channelUser: ChannelUser) => {
        return channelUser.userId == user?.id && channelUser.role != "USER";
      })
    )
      throw new UnauthorizedException("You are not authorized to modify this channel");
    await this.channelsService.update(updateChannelDto);
  }
}
