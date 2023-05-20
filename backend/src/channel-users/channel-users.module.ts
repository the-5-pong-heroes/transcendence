import { Module } from "@nestjs/common";
import { ChannelUsersService } from "./channel-users.service";
import { PrismaService } from "../database/prisma.service";

@Module({
  providers: [ChannelUsersService, PrismaService],
})
export class ChannelUsersModule {}
