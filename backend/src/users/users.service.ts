import { Injectable } from '@nestjs/common';
import {PrismaService} from '../database/prisma.service';

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
			const user = await this.prisma.auth.findFirst({
				where: {
					email: email,
				},
			});
			return user;
		} catch (error) {}
	}
}