import { Injectable } from "@nestjs/common";
import { ChannelUser } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";
import { UpdateChannelUserDto } from "./dto/update-channel-user.dto";

@Injectable()
export class ChannelUsersService {
  constructor(private prismaService: PrismaService) {}

  async findOne(id: string): Promise<any> {
    return this.prismaService.channelUser.findUnique({ where: { id } });
  }

  async findUser(id: string): Promise<any> {
    return this.prismaService.channelUser.findUnique({
      where: { id },
      select: { user: true, channelId: true },
    });
  }

  async update(data: UpdateChannelUserDto): Promise<ChannelUser> {
    return this.prismaService.channelUser.update({
      where: { id: data.id },
      data,
    });
  }

  async delete(id: string) {
    return this.prismaService.channelUser.delete({ where: { id } });
  }
}
