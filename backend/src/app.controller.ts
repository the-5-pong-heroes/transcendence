import { Controller, Get, UseGuards , Req} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(AuthGuard("google"))
  async googleAuth(@Req() req:any) {
    console.log(req.user);
  }

  @Get("auth/google/callback")
  @UseGuards(AuthGuard("google"))
  googleAuthRedirect(@Req() req:any){
    return this.appService.googleLogin(req)
  }
}