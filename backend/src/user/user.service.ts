import { PrismaService } from "../database/prisma.service";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { User, UserStatus } from "@prisma/client";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserWithAuth, UserWithFriends } from "src/common/@types";

@Injectable({})
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserByEmail(email: string): Promise<UserWithAuth | null> {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          auth: {
            email: email,
          },
        },
        include: {
          auth: true,
        },
      });
      return user;
    } catch (error) {
      return null;
    }
  }

  async remove(id: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) await this.prisma.user.delete({ where: { name: id } });
    else await this.prisma.user.delete({ where: { id } });
  }

  async create(createUserDto: CreateUserDto): Promise<UserWithAuth> {
    const user = await this.prisma.user.findUnique({
      where: { name: createUserDto.name },
    });
    if (user) {
      throw new ConflictException("User already exists");
    }
    const newUser = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        status: UserStatus.ONLINE,
        auth: {
          create: {
            email: createUserDto.email,
            password: createUserDto.password,
          },
        },
      },
      include: {
        auth: true,
      },
    });
    return newUser;
  }

  async findAll(): Promise<User[]> {
    const result: User[] = await this.prisma.user.findMany({
      include: {
        auth: true,
      },
    });
    return result;
  }

  async findOne(id: string): Promise<UserWithAuth> {
    const result = await this.prisma.user.findUnique({
      where: { id: id },
      include: {
        auth: true,
      },
    });
    if (result === null) {
      throw new NotFoundException();
    }
    return result;
  }

  async findOneById(id: string | undefined): Promise<UserWithFriends | null> {
    if (!id) return null;
    const user = this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        avatar: true,
        blocked: {
          select: {
            blockedUserId: true,
          },
        },
        friendships: {
          select: {
            addedBy: true,
          },
        },
        addedBy: {
          select: {
            userId: true,
          },
        },
        auth: true,
      },
    });
    return user;
  }

  async findUserByName(name: string): Promise<UserWithAuth | null> {
    const result = await this.prisma.user.findUnique({
      where: {
        name: name,
      },
      include: {
        auth: true,
      },
    });
    return result;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    const user = await this.findOneById(id);
    if (!user) {
      return;
    }
    await this.prisma.user.update({
      where: { id: id },
      data: { ...updateUserDto },
    });
  }

  async updateStatus(id: string, status: UserStatus): Promise<void> {
    const user = await this.findOneById(id);
    if (!user) {
      return;
    }
    await this.prisma.user.update({
      where: { id: id },
      data: { status },
    });
  }

  async getStatus(id: string): Promise<UserStatus | null> {
    const result: User | null = await this.prisma.user.findUnique({
      where: { id: id },
    });
    if (result) {
      return result.status;
    }
    return null;
  }

  // TODO TYPE ANY !
  async searchFirstMatch(payload: any, size: number): Promise<any[]> {
    const users = this.prisma.user.findMany({
      where: {
        name: {
          startsWith: payload.channelName,
          mode: "insensitive",
        },
        NOT: {
          OR: [
            {
              id: payload.userId,
            },
            {
              channelUsers: {
                some: {
                  channel: {
                    type: "DIRECT",
                    users: {
                      some: {
                        userId: payload.userId,
                      },
                    },
                  },
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
      },
    });
    return users;
  }

  // TODO TYPE ANY !
  async searchEndMatch(payload: any, channels: any[], size: number): Promise<any[]> {
    return this.prisma.user.findMany({
      where: {
        name: {
          contains: payload.channelName,
          mode: "insensitive",
        },
        NOT: {
          OR: [
            {
              id: payload.userId,
            },
            {
              id: {
                in: channels.map((channel) => channel.id),
              },
            },
            {
              channelUsers: {
                some: {
                  channel: {
                    type: "DIRECT",
                    users: {
                      some: {
                        userId: payload.userId,
                      },
                    },
                  },
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
      },
    });
  }
}
