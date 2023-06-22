import { PrismaService } from "../database/prisma.service";
import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException, Req } from "@nestjs/common";
import { Request } from "express";
import { Auth, User, UserStatus } from "@prisma/client";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable({})
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers(blockedOf: string) {
    const users = await this.prisma.user.findMany({});
  }

  async getUserByEmail(email: string) {
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
    } catch (error) {}
  }

  async getUsername(@Req() req: Request) {
    const accessToken = req.cookies.access_token;
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          auth: {
            accessToken: accessToken,
          },
        },
        include: {
          auth: true,
        },
      });
      return user;
    } catch (error) {}
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) await this.prisma.user.delete({ where: { name: id } });
    else await this.prisma.user.delete({ where: { id } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
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
    });
    return newUser;
  }

  async findAll(): Promise<User[]> {
    const result: User[] = await this.prisma.user.findMany();
    return result;
  }

  async findOne(id: string): Promise<User> {
    const result: User | null = await this.prisma.user.findUnique({
      where: { id: id },
    });
    if (result === null) {
      throw new NotFoundException();
    }
    return result;
  }

  async findOneById(id: string | undefined): Promise<any | null> {
    if (!id) return null;
    return this.prisma.user.findUnique({
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
      },
    });
  }

  async findUserByName(name: string): Promise<User | null> {
    const result: User | null = await this.prisma.user.findUnique({
      where: { name: name },
    });
    return result;
  }

  async findUserAuthByEmail(email: string): Promise<Auth | null> {
    if (!email) {
      return null;
    }
    const user = this.prisma.auth.findUnique({
      where: {
        email: email,
      },
    });

    return user;
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

  async searchFirstMatch(payload: any, size: number): Promise<any[]> {
    return this.prisma.user.findMany({
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
  }

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
