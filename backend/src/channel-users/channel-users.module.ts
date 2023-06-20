import { Module } from "@nestjs/common";
import { ChannelusersService } from "./channel-users.service";
import { PrismaService } from "../database/prisma.service";

@Module({
  providers: [ChannelusersService, PrismaService],
})
export class ChannelUsersModule {}
