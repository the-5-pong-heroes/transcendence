import { Body, Controller, Get, UseGuards, Req, Res, Post} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { GoogleAuthGuard } from './google/guards';
import { Request, Response } from "express";
import { UserDto } from "./dto";
import { UserService } from "src/users/users.service";
import { Oauth42Service } from "src/auth/auth42/Oauth42.service";


@Controller("auth")
export class AuthController{
    constructor(private authService: AuthService,
        private Oauth42: Oauth42Service,
        private userService: UserService,)  {}

    @Get("/Oauth42/login")
    async getUserByToken(@Req() req: Request) {
        return await this.authService.getUserByToken(req);
    }
    @Post("Oauth")
    async userOauthCreationInDataBase(@Req() req: Request, @Res() res: Response, @Body() UserDto: UserDto) {
        console.log("oauthcontroller");
        await this.authService.handleDataBaseCreation(req, res, UserDto);
    }

    @Get("/Oauth42/callback")
    async getToken(@Req() req: Request, @Res() res: Response) {
        const codeFromUrl = req.query.code as string;
        const token = await this.Oauth42.accessToken(codeFromUrl);
        const user42infos = await this.Oauth42.access42UserInformation(token.access_token);

         this.authService.createCookies(res, token);
         const userExists = await this.userService.getUserByEmail(user42infos.email);
         this.authService.updateCookies(res, token, userExists);
         this.authService.RedirectConnectingUser(req,res, userExists?.email);
     }

   @Get("token")
   async checkIfTokenValid(@Req() req: Request, @Res() res: Response) {
     return this.authService.checkIfTokenValid(req, res);
   }
}