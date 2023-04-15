import { Controller, Get, UseGuards} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { GoogleAuthGuard } from './google/guards';

@Controller("auth")
export class AuthController{
    constructor(private authService: AuthService)  {}

    //3333
    @Get("google/login")
    @UseGuards(GoogleAuthGuard)
    handleLogin() {
        return { msg: "Google Authentification "};
    }

    ///auth/google/callback
    @Get("/google/callback")
    @UseGuards(GoogleAuthGuard)
    handleRedirect() {
        return { msg: "OK"};
    }
}