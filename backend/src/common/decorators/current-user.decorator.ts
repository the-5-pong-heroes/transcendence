import { createParamDecorator, ExecutionContext } from "@nestjs/common";

/**
 * Custom decorator that extracts the user information from the request cookies
 *
 * See here for more info: https://docs.nestjs.com/custom-decorators
 */
export const CurrentUser = createParamDecorator(async (data: string | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.currentUser;
  // returns either the [data] property or the whole user object
  return data ? user?.[data] : user;
});
