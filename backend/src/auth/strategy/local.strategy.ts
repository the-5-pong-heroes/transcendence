import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { Auth } from "@prisma/client";

/* Sign in Guard */

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: "email" });
  }

  async validate(email: string, password: string): Promise<Auth> {
    const auth = await this.authService.validateUserJwt({ email, password });
    if (!auth) {
      throw new UnauthorizedException();
    }
    return auth;
  }
}
