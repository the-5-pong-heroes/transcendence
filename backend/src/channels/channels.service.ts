import { Injectable } from "@nestjs/common";
import { CreateChannelDto } from "./dto/create-channel.dto";
import { PrismaService } from "../database/prisma.service";
import { UserService } from "../user/user.service";
import { Channel, ChannelUser } from "@prisma/client";
import { UpdateChannelDto } from "./dto/update-channel.dto";

@Injectable()
export class ChannelsService {
  constructor(private readonly prismaService: PrismaService, private readonly userService: UserService) {}

  async create(createChannelDto: CreateChannelDto): Promise<Channel> {
    const { users, ...data } = createChannelDto;
    return this.prismaService.channel.create({
      data: {
        ...data,
        users: {
          create: [
            {
              ...users,
              role: "OWNER",
            },
          ],
        },
      },
    });
  }

  async createDirect(data: any): Promise<Channel> {
    return this.prismaService.channel.create({
      data: {
        type: data.type,
      },
    });
  }

  async findAll(userId: string): Promise<Channel[]> {
    const channels = await this.prismaService.channel.findMany({
      where: {
        users: {
          some: {
            userId,
          },
        },
      },
      include: {
        messages: {
          include: {
            sender: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
        users: {
          select: {
            id: true,
            role: true,
            isAuthorized: true,
            isMuted: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        banned: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
            bannedUntil: true,
          },
        },
      },
      orderBy: { lastMessage: "desc" },
    });
    channels.map((channel) => {
      if (
        channel.type === "PROTECTED" &&
        channel.users.find((user) => user.user.id === userId)?.isAuthorized === false
      ) {
        channel.password = null;
        channel.messages = [];
      }
      if (!channel.name) {
        const newChannelName = channel.users.find((user) => user.user.id !== userId)?.user.name;
        if (newChannelName) channel.name = newChannelName;
      }
      return channel;
    });
    return channels;
  }

  async findOne(id: string): Promise<any> {
    return this.prismaService.channel.findUnique({
      where: { id },
      include: {
        users: true,
      },
    });
  }

  async findOneWithOwner(id: string): Promise<(Channel & { users: ChannelUser[] }) | null> {
    return this.prismaService.channel.findUnique({
      where: { id },
      include: {
        users: {
          where: {
            role: "OWNER",
          },
        },
      },
    });
  }

  async searchFirstMatch(payload: any): Promise<any[]> {
    return this.prismaService.channel.findMany({
      where: {
        name: {
          startsWith: payload.channelName,
          mode: "insensitive",
        },
        type: { in: ["PUBLIC", "PROTECTED"] },
        users: { none: { userId: payload.userId } },
        NOT: {
          banned: {
            some: {
              userId: payload.userId,
            },
          },
        },
      },
      orderBy: { name: "asc" },
      take: 5,
      select: {
        id: true,
        name: true,
        type: true,
      },
    });
  }

  async searchEndMatch(payload: any, channels: any[], size: number): Promise<any[]> {
    return this.prismaService.channel.findMany({
      where: {
        name: {
          contains: payload.channelName,
          mode: "insensitive",
        },
        type: { in: ["PUBLIC", "PROTECTED"] },
        users: { none: { userId: payload.userId } },
        NOT: {
          OR: [
            {
              id: {
                in: channels.map((channel) => channel.id),
              },
            },
            {
              banned: {
                some: {
                  userId: payload.userId,
                },
              },
            },
          ],
        },
      },
      orderBy: { name: "asc" },
      take: size,
      select: {
        id: true,
        name: true,
        type: true,
      },
    });
  }

  async searchAll(payload: any): Promise<any[]> {
    let channels = [];
    const firstChannels = await this.searchFirstMatch(payload);
    channels = firstChannels;
    if (channels.length >= 5) return channels;
    const users = await this.userService.searchFirstMatch(payload, 5 - channels.length);
    channels = [...channels, ...users];
    if (channels.length >= 5) return channels;
    const endChannels = await this.searchEndMatch(payload, firstChannels, 5 - channels.length);
    channels = [...channels, ...endChannels];
    if (channels.length >= 5) return channels;
    const endUsers = await this.userService.searchEndMatch(payload, users, 5 - channels.length);
    return [...channels, ...endUsers];
  }

  async update(updateChannelDto: UpdateChannelDto): Promise<Channel> {
    const { users, banned, ...data } = updateChannelDto;
    return this.prismaService.channel.update({
      where: { id: updateChannelDto.id },
      data: {
        ...data,
      },
    });
  }

  delete(id: string) {
    return this.prismaService.channel.delete({ where: { id } });
  }
}
