import { Prisma } from "@prisma/client";

const userWithAuth = Prisma.validator<Prisma.UserArgs>()({
  include: { auth: true },
});

export type UserWithAuth = Prisma.UserGetPayload<typeof userWithAuth>;
