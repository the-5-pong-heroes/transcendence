import { Injectable, UnauthorizedException, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Socket } from "socket.io";
import { Observable } from "rxjs";
import { parse } from "cookie";
import { AuthService } from "src/auth/auth.service";
import * as cookieParser from "cookie-parser";
import { COOKIES_SECRET } from "src/common/constants";

@Injectable()
export class WebSocketInterceptor implements NestInterceptor {
  constructor(private authService: AuthService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const wsContext = context.switchToWs();
    const client: Socket = wsContext.getClient();
    const handshakeCookie = client.handshake.headers.cookie;
    if (!handshakeCookie || !client.handshake.auth) {
      client.disconnect();
      throw new UnauthorizedException("Not authenticated");
    }
    const signedCookies = parse(handshakeCookie).access_token;
    let token = null;
    if (COOKIES_SECRET !== undefined) {
      token = cookieParser.signedCookie(signedCookies, COOKIES_SECRET);
    }
    if (!token) {
      client.disconnect();
      throw new UnauthorizedException("Not authenticated");
    }
    // console.log("💥 WebSocketInterceptor");
    const user = await this.authService.validateUser(token);
    if (!user) {
      client.disconnect();
      throw new UnauthorizedException("Not authenticated");
    }

    // Call next.handle() to continue the execution
    return next.handle();
  }
}
