import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PrismaService } from "src/database/prisma.service";
import { User, UserStatus, Auth } from "@prisma/client";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

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

  async findUserById(id: string): Promise<User | null> {
    const result: User | null = await this.prisma.user.findUnique({
      where: { id: id },
    });
    return result;
  }

  async findUserByName(name: string): Promise<User | null> {
    const result: User | null = await this.prisma.user.findUnique({
      where: { name: name },
    });
    return result;
  }

  async findUserAuthByEmail(email: string): Promise<Auth | null> {
    const user = this.prisma.auth.findUnique({
      where: {
        email: email,
      },
    });

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.prisma.user.update({
      where: { id: id },
      data: { ...updateUserDto },
    });
  }

  async updateStatus(id: string, status: UserStatus) {
    await this.prisma.user.update({
      where: { id: id },
      data: { status: status },
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

  async remove(id: string): Promise<User> {
    try {
      const result: User = await this.prisma.user.delete({
        where: { id: id },
      });
      return result;
    } catch (e) {
      throw new NotFoundException(e);
    }
  }
}
