import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { User } from "@prisma/client";

@Injectable()
export class FriendshipService {
  constructor(private prismaService: PrismaService) {}

  async create(user: User, newFriendId: string) {
    return this.prismaService.friendship.create({
      data: {
        userId: newFriendId,
        addedById: user.id,
      },
    });
  }

  async delete(user: User, friendId: string) {
    return this.prismaService.friendship.deleteMany({
      where: {
        userId: friendId,
        addedById: user.id,
      },
    });
  }
}
