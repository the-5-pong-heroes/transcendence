import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
// import { userService } from "src/users_paul/users.service";
import { userService } from "src/user/users.service";

@Injectable()
export class BlockedService {
  constructor(private prismaService: PrismaService, private userService: userService) {}

  async create(data: any) {
    return this.prismaService.blocked.create({
      data: {
        blockedUserId: data.blockedUserId,
        userId: data.userId,
      },
    });
  }

  async delete(data: any) {
    return this.prismaService.blocked.deleteMany({
      where: {
        blockedUserId: data.blockedUserId,
        userId: data.userId,
      },
    });
  }
}
