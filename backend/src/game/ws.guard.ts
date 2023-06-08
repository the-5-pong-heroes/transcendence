import { Injectable, CanActivate } from "@nestjs/common";
import { Socket } from "socket.io";

import { AuthService } from "src/auth/auth.service";
import { parse } from "cookie";

@Injectable()
export class WsGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: any): Promise<boolean> {
    const client: Socket = context;
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
