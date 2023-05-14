import { createParamDecorator, ExecutionContext } from "@nestjs/common";

import { PrismaClient } from "@prisma/client";

export const CurrentUser = createParamDecorator(async (data: string | undefined, ctx: ExecutionContext) => {
  // FIXME to uncomment when the Auth module is ready
  // ######
  // const request = ctx.switchToHttp().getRequest();
  // const user = request.user;
  // ######
  let name;
  name = "Robtoine Collant";
  name = "John Doe";
  name = "Jane Smith";
  const prisma = new PrismaClient();
  const user: any = await prisma.user.findUniqueOrThrow({ where: { name: name } });
  // ######

  // extracts the [data] property or the whole user object
  return data ? user?.[data] : user;
});
