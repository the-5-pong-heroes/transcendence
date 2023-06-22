import { Injectable } from "@nestjs/common";
import { ChannelUser } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";
import { CreateChannelUserDto } from "./dto/create-channel-user.dto";
import { UpdateChannelUserDto } from "./dto/update-channel-user.dto";

@Injectable()
export class ChannelUsersService {
  constructor(private prismaService: PrismaService) {}

  async create(data: CreateChannelUserDto): Promise<ChannelUser> {
    return this.prismaService.channelUser.create({ data });
  }

  async findOne(id: string): Promise<ChannelUser | null> {
    return this.prismaService.channelUser.findUnique({ where: { id } });
  }

  async findUser(id: string): Promise<any> {
    return this.prismaService.channelUser.findUnique({
      where: { id },
      select: { user: true, channelId: true },
    });
  }

  async findFirst(data: any): Promise<ChannelUser | null> {
    return this.prismaService.channelUser.findFirst({ where: { ...data } });
  }

  async findFromChannel(channelId: string): Promise<ChannelUser[]> {
    return this.prismaService.channelUser.findMany({ where: { channelId } });
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

  async deleteAllFromChannel(channelId: string) {
    return this.prismaService.channelUser.deleteMany({ where: { channelId } });
  }

  async deleteUser(data: any) {
    return this.prismaService.channelUser.deleteMany({ where: { ...data } });
  }
}
