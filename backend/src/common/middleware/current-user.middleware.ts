import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { AuthService } from "src/auth/auth.service";
import { User } from "@prisma/client";

export interface RequestWithUser extends Request {
  // currentUser: User;
  currentUser: User | null;
}

/**
 * Middleware that extracts the user information from the request's
 * cookies and attaches it to the request object.
 *
 * See here for more info: https://docs.nestjs.com/middleware
 */
@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: RequestWithUser, res: Response, next: NextFunction) {
    // if ("access_token" in req.cookies) {
    //   const user = await this.authService.getUserByToken(req);
    //   req["currentUser"] = user;
    // } else {
    //   // there are not any 'token' in the cookies
    //   req["currentUser"] = null;
    // }
    const token = req.cookies["access_token"];
    console.log("🍏", token);
    if (!token) {
      throw new UnauthorizedException("Not authenticated");
    }
    const user = await this.authService.validateUser(token);
    //   const user = await this.authService.getUserByToken(req);
    if (!user) {
      throw new UnauthorizedException("Not authenticated");
    }
    req["currentUser"] = user;
    next();
  }
}
