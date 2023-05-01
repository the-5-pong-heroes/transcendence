import { createParamDecorator, ExecutionContext } from "@nestjs/common";

// import { PrismaService } from "src/database/prisma.service";

// const prisma: PrismaService = new PrismaService();

export const CurrentUser = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  console.log("🐳🐳🐳🐳", request);
  const user = request.user;
  // const users = prisma.user.findAll({
  //   // where: {
  //   //   name: "John Doe",
  //   // },
  // });
  return data ? user?.[data] : user;
});
