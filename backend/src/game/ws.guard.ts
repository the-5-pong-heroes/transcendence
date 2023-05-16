import { Injectable, CanActivate } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { UserService } from "src/user/user.service";

@Injectable()
export class WsGuard implements CanActivate {
  constructor(private jwtService: JwtService, private userService: UserService) {}

  canActivate(context: any): boolean | any | Promise<boolean> {
    const bearerToken = context.args[0].handshake.headers.authorization.split(" ")[1];
    try {
      const payload = this.jwtService.verify(bearerToken, { secret: "secret" }) as any;
      return new Promise((resolve, reject) => {
        return this.userService.findUserById(payload.sub).then((user: User | null) => {
          if (user) {
            resolve(user);
          } else {
            reject(false);
            throw new WsException("Unauthorized");
          }
        });
      });
    } catch (ex) {
      throw new WsException("Unauthorized");
    }
  }
}
