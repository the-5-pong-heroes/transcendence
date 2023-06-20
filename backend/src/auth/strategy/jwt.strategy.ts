import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Request } from "express";

import { JwtPayload } from "../interface/jwt-payload.interface";
import { UserService } from "src/user/user.service";
import { Auth } from "@prisma/client";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWTFromCookie]),
      ignoreExpiration: false,
      secretOrKey: "secret",
    });
  }

  private static extractJWTFromCookie(req: Request): string | null {
    if (req.signedCookies && req.signedCookies.access_token) {
      return req.signedCookies.access_token;
    }
    return null;
  }

  async validate(payload: JwtPayload): Promise<Auth> {
    const { email } = payload;
    const auth = await this.userService.findUserAuthByEmail(email);
    if (!auth) {
      throw new UnauthorizedException();
    }
    return auth;
  }
}
