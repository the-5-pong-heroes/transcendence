import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
  BadRequestException,
  UnauthorizedException,
} from "@nestjs/common";
import { ChannelUser } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";
import { MessagesService } from "../messages/messages.service";
import { ChannelsService } from "./channels.service";
import { CreateChannelDto } from "./dto/create-channel.dto";
import { UpdateChannelDto } from "./dto/update-channel.dto";
import { UserGuard } from "src/auth/user.guard";

@Controller("chat")
@UseGuards(UserGuard)
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
  findAll(@Req() req: any) {
    return this.channelsService.findAll(req.user.id);
  }

  @Get(":id")
  findMessages(@Param("id") id: string) {
    return this.messageService.findAll(id);
  }

  @Get("search/:name")
  searchChannels(@Param("name") name: string, @Req() req: any) {
    return this.channelsService.searchAll({
      channelName: name,
      userId: req.user.id,
    });
  }

  @Put(":id")
  async update(@Param("id") id: string, @Req() req: any, @Body() updateChannelDto: UpdateChannelDto) {
    if (id != updateChannelDto.id) throw new BadRequestException("Wrong Channel");
    const user = await this.prismaService.user.findUnique({
      where: { id: req.user.id },
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

  @Delete(":id")
  async remove(@Param("id") id: string, @Req() req: any) {
    const channel = await this.channelsService.findOneWithOwner(id);
    //if (channel.users.some((user) => user.userId !== req.user.id))
    //throw new UnauthorizedException("You are not the owner of this channel");
    //return this.channelsService.delete(id);
  }
}
