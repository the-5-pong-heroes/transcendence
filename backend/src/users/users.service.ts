import {PrismaService} from '../database/prisma.service';
import {HttpException, HttpStatus, Injectable} from '@nestjs/common';


@Injectable({})
export class UserService {
	constructor(
		private readonly prisma: PrismaService,
	) {}

	async getAllUsers(blockedOf: string) {
			const users = await this.prisma.user.findMany({});
		}

	async getUserByEmail(email: string) {
		try {
			const user = await this.prisma.user.findFirst({
				where: {
					auth: {
						email: email,
					},
				},
				include: {
					auth: true,
				  },
			});
			return user;
		} catch (error) {}
	}
}