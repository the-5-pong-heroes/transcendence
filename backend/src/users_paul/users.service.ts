import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { Auth, User } from "@prisma/client";

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<Auth> {
    return this.prismaService.auth.create({
      data: {
        ...createUserDto,
        user: {
          create: {
            name: createUserDto.email,
            status: "ONLINE",
          },
        },
      },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }

  async findOne(name: string): Promise<User | null> {
    return this.prismaService.user.findUnique({ where: { name } });
  }

  async findOneById(id: string | undefined): Promise<User | null> {
    if (!id) return null;
    return this.prismaService.user.findUnique({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) await this.prismaService.user.delete({ where: { name: id } });
    else await this.prismaService.user.delete({ where: { id } });
  }
}
