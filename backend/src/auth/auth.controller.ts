import { Body, Controller, Get, UseGuards, Req, Res, Post} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Generate2FAService } from "./2FA/generate.service";
import { EnableService } from "./2FA/enable2FA.service";
import { GoogleAuthGuard } from './google/guards';
import { Request, Response } from "express";
import { UserDto } from "./dto";
import { UserService } from "src/users/users.service";
import { Oauth42Service } from "src/auth/auth42/Oauth42.service";
import { GoogleService } from "src/auth/google/google.service"


@Controller("auth")
export class AuthController{
    constructor(private authService: AuthService,
        private Oauth42: Oauth42Service,
        private userService: UserService,
        private googleService: GoogleService,
        private Generate2FA: Generate2FAService, 
        private enable2FAService: EnableService,
        )  {}

    @Get("Oauth42/login")
    async getUserByToken(@Req() req: Request) {
        return await this.authService.getUserByToken(req);
    }
    
    @Post("Oauth")
    async userOauthCreationInDataBase(@Req() req: Request, @Res() res: Response, @Body() UserDto: UserDto) {
        await this.authService.handleDataBaseCreation(req, res, UserDto);
    }

    @Get("auth42/callback")
    async getToken(@Req() req: Request, @Res() res: Response) {
        const codeFromUrl = req.query.code as string;
        const token = await this.Oauth42.accessToken(codeFromUrl);
        const user42infos = await this.Oauth42.access42UserInformation(token.access_token);
        this.authService.createCookies(res, token);
        if (!user42infos.email)
            res.redirect(301, `http://localhost:5173/`);
        else
        {
            const userExists = await this.userService.getUserByEmail(user42infos.email);
            if (!userExists)
                this.authService.createDataBase42User(user42infos, token, user42infos.login, false);
            else
            {
                this.authService.updateCookies(res, token, userExists);
                this.enable2FAService.update2FA(res, token, userExists);
                console.log(userExists.auth);
                if (!userExists.auth?.twoFAactivated)
                    res.redirect(301, `http://localhost:5173/`); // ou /Profile ?
                else
                    this.Generate2FA.sendActivationMail(userExists); //2FA page
            }
        }
        //res.redirect(301, `http://localhost:5173/`);
        //this.authService.RedirectConnectingUser(req,res, userExists?.auth.email);
     }

   @Get("token")
   async checkIfTokenValid(@Req() req: Request, @Res() res: Response) {
     return this.authService.checkIfTokenValid(req, res);
   }

   @Get("2FA")
   async enable2FA(@Req() req: Request, @Res() res: Response) {
     return this.enable2FAService.EnableService(req, res);
   }

//    @Get("google/callback")
//      async handleGoogleRedirection(@Req() req: Request, @Res() res: Response) {
//       const codeFromUrl = req.query.code as string;
//       const token: any = await this.googleService.getTokenFromGoogle(codeFromUrl);
//       const userInfos : any = await this.googleService.getUserFromGoogle(token);
//       this.authService.createCookies(res, userInfos);
//       const userExists = await this.userService.getUserByEmail(userInfos.email);
//       this.authService.updateCookies(res, token, userExists);
//       //this.authService.RedirectConnectingUser(req, res, userExists?.email);
//    }
  
//    @Get("logout")
//    async deleteCookies(@Req() req: Request, @Res() res: Response) {
//      await this.authService.deleteCookies(res);
//    }
}