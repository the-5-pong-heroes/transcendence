import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class BlockedService {
  constructor(private prismaService: PrismaService) {}

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
