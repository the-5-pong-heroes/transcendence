import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class FriendshipService {
  constructor(private prismaService: PrismaService) {}

  async create(data: any, user: any) {
    // console.log("🏓", data.newFriendId, user.userId);
    return this.prismaService.friendship.create({// FIXME
      data: {
        userId: data.newFriendId,
        addedById: user.id,
        // addedById: user.userId,
      },
    });
  }

  async delete(data: any, user: any) {
    return this.prismaService.friendship.deleteMany({
      where: {
        userId: data.friendId,
        addedById: user.userId,
      },
    });
  }
}
