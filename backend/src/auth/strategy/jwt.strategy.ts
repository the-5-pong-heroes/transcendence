import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Request } from "express";

import { JwtPayload } from "../interface/jwt-payload.interface";
import { UsersService } from "src/users/users.service";
import { Auth } from "@prisma/client";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWTFromCookie]),
      ignoreExpiration: false,
      secretOrKey: "secret",
    });
  }

  private static extractJWTFromCookie(req: Request): string | null {
    if (req.cookies && req.cookies.access_token) {
      return req.cookies.access_token;
    }
    return null;
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