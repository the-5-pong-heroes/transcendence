import { Controller, Post, Body, UseGuards, Req } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../users_paul/dto/create-user.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  async signUp(@Body() createUserDto: CreateUserDto): Promise<{ access_token: string | null }> {
    const token = await this.authService.signUp(createUserDto);
    return { access_token: token };
  }

  @UseGuards(AuthGuard("local"))
  @Post("signin")
  async signIn(@Req() req: any): Promise<{ access_token: string | null }> {
    const token = await this.authService.signIn(req.user);
    return token;
  }
}
