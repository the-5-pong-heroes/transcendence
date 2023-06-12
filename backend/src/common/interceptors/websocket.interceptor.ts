import { Injectable, UnauthorizedException, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Socket } from "socket.io";
import { Observable } from "rxjs";
import { parse } from "cookie";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class WebSocketInterceptor implements NestInterceptor {
  constructor(private authService: AuthService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const wsContext = context.switchToWs();
    const client: Socket = wsContext.getClient();
    const cookieHeader = client.handshake.headers.cookie;
    if (!cookieHeader || !client.handshake.auth) {
      client.disconnect();
      throw new UnauthorizedException("Not authenticated");
    }
    const cookies = parse(cookieHeader);
    const access_token = cookies.access_token;
    const user = await this.authService.validateUser(access_token);
    if (!user) {
      client.disconnect();
      throw new UnauthorizedException("Not authenticated");
    }

    // Call next.handle() to continue the execution
    return next.handle();
  }
}
