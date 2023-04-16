import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from './users.service';
import { Request } from 'express';

@Controller('users')
export class UserController {
	constructor(
		private userService: UserService,
	) {}

	@Get()
	async getUsers(@Req() req: Request) {
		const blockedOf = req.query.blockedOf as string;
		return this.userService.getAllUsers(blockedOf);
	}
}