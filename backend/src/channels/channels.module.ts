import { Module } from "@nestjs/common";
import { ChannelsController } from "./channels.controller";
import { ChannelsGateway } from "./channels.gateway";
import { ChannelsService } from "./channels.service";
import { MessagesService } from "../messages/messages.service";
import { UserService } from "../users/users.service";
import { PrismaService } from "../database/prisma.service";
import { ChannelUsersService } from "../channel-users/channel-users.service";
import { MessagesModule } from "../messages/messages.module";
import { ChannelUsersModule } from "../channel-users/channel-users.module";

@Module({
  imports: [MessagesModule, ChannelUsersModule],
  controllers: [ChannelsController],
  providers: [
    ChannelsGateway,
    ChannelsService,
    MessagesService,
    ChannelUsersService,
    UserService,
    PrismaService,
  ],
})
export class ChannelsModule {}
