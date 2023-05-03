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
}