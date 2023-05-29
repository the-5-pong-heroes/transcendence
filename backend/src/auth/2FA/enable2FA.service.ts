import { PrismaService } from "../../database/prisma.service";
import { Request, Response } from "express";
import { HttpException, HttpStatus, Injectable, Req, Res } from '@nestjs/common';


@Injectable()
export class EnableService {
	constructor( private readonly prisma: PrismaService) {}

  async EnableService(@Req() req: Request, @Res() res: Response) {
    try{
        const updatedUser = await this.updateUser(req);
        res.status(200).json({
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
		  auth: {
	//		twoFAactivated: updatedUser.twoFAactivated,
		  }
      },
      });
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: "Error to enable the 2FA"},
        HttpStatus.BAD_REQUEST);
    }
  }
  
  async updateUser(@Req() req: Request) {
		try {
			const { userName } = req.body;
			const updatedUser = await this.prisma.user.update({
			where: {name : userName},
			data: {
				auth: {
					update: {
						twoFAactivated: true,
					}
				}
			},
			include: {
				auth: true,
			  },
			});
			console.log(updatedUser.auth);
			return updatedUser;
		}
		catch(error)
		{
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: "Fail to update user in Disable 2FA "},
				 HttpStatus.BAD_REQUEST);
		}
	}


async update2FA(@Res() res: Response, token: any, userInfos: any) {
	try {
	  if (userInfos)
	  { 
		const name = userInfos.id;
		const user = await this.prisma.auth.update(
		  { where: {
			  userId: name,
			},
			data: {  
				twoFAactivated: true,                      
			},
		  });
		return user;
	  }
	  else
		return (null);
	} catch (error)
	{
		throw new HttpException({
		status: HttpStatus.BAD_REQUEST,
		error: "Error to update the cookies"},
		HttpStatus.BAD_REQUEST);
	}
	}
}
