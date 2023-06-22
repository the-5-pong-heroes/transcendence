import { Injectable, UnauthorizedException, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Socket } from "socket.io";
import { Observable } from "rxjs";
import { parse } from "cookie";
import { AuthService } from "src/auth/auth.service";
import * as cookieParser from "cookie-parser";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class WebSocketInterceptor implements NestInterceptor {
  constructor(private authService: AuthService, private config: ConfigService) {}

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
    const cookies_salt = this.config.get("COOKIES_SECRET");
    if (cookies_salt !== undefined) {
      token = cookieParser.signedCookie(signedCookies, cookies_salt);
    }
    if (!token) {
      client.disconnect();
      throw new UnauthorizedException("Not authenticated");
    }
    const user = await this.authService.validateUser(token);
    if (!user) {
      client.disconnect();
      throw new UnauthorizedException("Not authenticated");
    }

    // Call next.handle() to continue the execution
    return next.handle();
  }
}
