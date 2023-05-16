import { Controller, Post, Body, UseGuards, Req } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../user/dto";
import { User } from "@prisma/client";

// export interface AuthUser {
//   accessToken: string;
//   user: {
//     name: string;
//     id: string;
//     avatar?: string;
//   };
// }

export interface UserAuth {
  accessToken: string;
  user: User;
}

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  async signUp(@Body() createUserDto: CreateUserDto): Promise<UserAuth> {
    return this.authService.signUp(createUserDto);
  }

  @UseGuards(AuthGuard("local"))
  @Post("signin")
  async signIn(@Req() req: any): Promise<UserAuth> {
    return await this.authService.signIn(req.user);
  }
}
