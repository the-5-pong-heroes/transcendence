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

	async findOne(name: string){
		return this.prisma.user.findUnique({ where: { name } });
	}

	async findOneById(id: string | undefined){
	if (!id) return null;
		return this.prisma.user.findUnique({ where: { id } });
	}

	async remove(id: string) {
		const user = await this.prisma.user.findUnique({
			where: { id },
	});

	if (!user) await this.prisma.user.delete({ where: { name: id } });
		else await this.prisma.user.delete({ where: { id } });
	}

}