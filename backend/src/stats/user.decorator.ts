import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const UserId = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const user = {};
    console.log(ctx);
    return {};
    // return data ? user?.[data] : user;
  },
);
