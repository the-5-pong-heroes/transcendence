import { ExecutionContext, Injectable, CanActivate } from "@nestjs/common";
import { parse } from "cookie";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const cookieHeader = request.headers.cookie;
    if (!cookieHeader) {
      return false;
    }
    const cookies = parse(cookieHeader);
    const access_token = cookies.access_token;
    const user = await this.authService.validateUser(access_token);
    if (!user) {
      return false;
    }
    request.user = user;
    return true;
  }
}
