import { Module } from "@nestjs/common";
import { ChannelsController } from "./channels.controller";
import { ChannelsGateway } from "./channels.gateway";
import { ChannelsService } from "./channels.service";
import { MessagesService } from "../messages/messages.service";
import { UsersService } from "../users/users.service";
// import { UsersService } from "../users_paul/users.service";
import { PrismaService } from "../database/prisma.service";
import { ChannelUsersService } from "../channel-users/channel-users.service";
import { MessagesModule } from "../messages/messages.module";
import { ChannelUsersModule } from "../channel-users/channel-users.module";
import { ChannelGuard } from "./guard";
import { AuthModule } from "src/auth/auth.module";
import { BlockedService } from "src/blocked/blocked.service";

@Module({
  imports: [MessagesModule, ChannelUsersModule, AuthModule],
  controllers: [ChannelsController],
  providers: [
    ChannelsGateway,
    ChannelsService,
    MessagesService,
    ChannelUsersService,
    UsersService,
    PrismaService,
    ChannelGuard,
    BlockedService,
  ],
})
export class ChannelsModule {}
