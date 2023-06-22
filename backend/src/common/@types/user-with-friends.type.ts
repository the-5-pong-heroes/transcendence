import { Prisma } from "@prisma/client";

const userWithFriends = Prisma.validator<Prisma.UserArgs>()({
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

export type UserWithFriends = Prisma.UserGetPayload<typeof userWithFriends>;
