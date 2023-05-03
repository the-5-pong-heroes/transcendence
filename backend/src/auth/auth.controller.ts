import { Body, Controller, Get, UseGuards, Req, Res, Post} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { GoogleAuthGuard } from './google/guards';
import { Request, Response } from "express";
import { UserDto } from "./dto";
import { Oauth42Service } from "src/auth/auth42/Oauth42.service";


@Controller("auth")
export class AuthController{
    constructor(private authService: AuthService,
        private Oauth42: Oauth42Service,)  {}

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

    /***  Create the user in database from the page registration ***/
    @Get("getuserbytoken")
    async getUserByToken(@Req() req: Request) {
        return await this.authService.getUserByToken(req);
    }
    @Post("Oauth")
    async userOauthCreationInDataBase(@Req() req: Request, @Res() res: Response, @Body() UserDto: UserDto) {
        await this.authService.handleDataBaseCreation(req, res, UserDto);
    }

    /***  After the user said yes to connect to 42 API, we attribute the token and we check if he exists in the database ***/
    @Get("callback")
    async getToken(@Req() req: Request, @Res() res: Response) {
        const codeFromUrl = req.query.code as string;
        const token = await this.Oauth42.accessToken(codeFromUrl);
        const user42infos = await this.Oauth42.access42UserInformation(
        token.access_token
        );

//         this.authService.createCookies(res, token);
//         const userExists = await this.userService.getUserByEmail(user42infos.email);
//         this.authService.updateCookies(res, token, userExists);
//         this.authService.RedirectConnectingUser(req,res, userExists?.email);
     }

//   @Get("token")
//   async checkIfTokenValid(@Req() req: Request, @Res() res: Response) {
//     return this.authService.checkIfTokenValid(req, res);
//   }
}