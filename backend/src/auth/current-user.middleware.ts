import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { User } from "@prisma/client";

export interface RequestWithUser extends Request {
  currentUser?: User | null;
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
    if ("token" in req.cookies) {
      const user = await this.authService.getUserByToken(req);
      req["currentUser"] = user;
    } else {
      // there are not any 'token' in the cookies
      req["currentUser"] = null;
    }
    next();
  }
}
