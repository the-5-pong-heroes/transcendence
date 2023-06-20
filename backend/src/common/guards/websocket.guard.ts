import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Socket } from "socket.io";

import { AuthService } from "src/auth/auth.service";
import { parse } from "cookie";

@Injectable()
export class WebSocketGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const wsContext = context.switchToWs();
    const client: Socket = wsContext.getClient();
    const cookieHeader = client.handshake.headers.cookie;
    if (!cookieHeader || !client.handshake.auth) {
      client.disconnect();
      return false;
    }
    const cookies = parse(cookieHeader);
    const access_token = cookies.access_token;
    const user = await this.authService.validateUser(access_token);
    if (!user) {
      client.disconnect();
      return false;
    }
    client.data.userName = client.handshake.auth.name;
    client.data.userId = client.handshake.auth.id;
    client.data.readyToPlay = false;
    return true;
  }
}
