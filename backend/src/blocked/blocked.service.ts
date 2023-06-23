import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class BlockedService {
  constructor(private prismaService: PrismaService) {}

  async find(id: string) {
	return this.prismaService.blocked.findMany({
	  where: { userId: id },
	});
  }

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
