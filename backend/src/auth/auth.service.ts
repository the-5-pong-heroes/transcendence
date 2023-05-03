import { Req, Res, Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Request, Response, request } from "express";
//import { AuthDto } from './dto';
import { Oauth42Service } from "src/auth/auth42/Oauth42.service";
import { UserDto } from "./dto";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService,
        private Oauth42: Oauth42Service,) {}

    async createDataBase42User(
        user42: any,
        token: string,
        username: string,
        isRegistered: boolean
    ){
        try {
            const user = await this.prisma.user.create({
                data: { 
                    name: username,
                    auth: {
                        create: {
                            accessToken: token,
                            isRegistered: isRegistered,
                            email: user42.email,
                            password: 'test',
                        }
                    },
                    status: "ONLINE",
                    last_login: new Date()
                }
            });
            return user;
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: "Error to create the user to the database"
                }, HttpStatus.BAD_REQUEST);
        }
    }
    
    
    // async createDataBase42User(
    //     user42: any,
    //     token: string,
    //     username: string,
    //     isRegistered: boolean
    //     ) {
    //     try {
    //         const user = await this.prisma.user.create({
    //         data: {
    //             accessToken: token,
    //             isRegistered: isRegistered,
    //             name: username,
    //             email: user42.email,
    //         },
    //         });
        
    //         return user;
    //     } catch (error) {
    //         throw new HttpException(
    //         {
    //         status: HttpStatus.BAD_REQUEST,
    //         error: "Error to create the user to the database"
    //         }, HttpStatus.BAD_REQUEST);
    //         };
    //     }
        
    async getUserByToken(req: Request) {
        try {
                const accessToken = req.cookies.token;
                const user = await this.prisma.auth.findFirst({
                where: {
                    accessToken: accessToken,
                },
                });
                if (!user)
                {
                throw new HttpException(
                    {
                    status: HttpStatus.BAD_REQUEST,
                    error: "Error to get the user by token"},
                    HttpStatus.BAD_REQUEST);
                    };
                return user;
        } catch (error) {
            throw new HttpException(
            {
                status: HttpStatus.BAD_REQUEST,
                error: "Error to get the user by token"},
                HttpStatus.BAD_REQUEST);
        };
    }
    
    async handleDataBaseCreation(@Req() req: Request, @Res() res: Response, @Body() UserDto: UserDto) {
        const token: string = req.cookies.token;
        const user42infos = await this.Oauth42.access42UserInformation(token);
        if (user42infos)
          {
            const finalUser = await this.Oauth42.createDataBase42User(    user42infos,
            token,
            req.body.name,
            req.body.isRegistered);
            return res.status(200).json({
            statusCode: 200,
            path: finalUser,
          });
        }
//        await this.googleService.handleGoogleUserCreation(res, req);
      }
}