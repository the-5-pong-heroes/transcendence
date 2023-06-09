import { Module } from "@nestjs/common";
import { ChanneluserService } from "./channel-users.service";
import { PrismaService } from "../database/prisma.service";

@Module({
  providers: [ChanneluserService, PrismaService],
})
export class ChannelUsersModule {}
