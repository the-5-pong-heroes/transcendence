import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { JwtPayload } from "../interface/jwt-payload.interface";
import { UserService } from "../../user/user.service";
import { Auth } from "@prisma/client";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: "secret",
    });
  }

  async validate(payload: JwtPayload): Promise<Auth> {
    const { email } = payload;
    const user = await this.usersService.findUserAuthByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
