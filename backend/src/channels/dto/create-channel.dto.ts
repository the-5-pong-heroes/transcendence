import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ChannelType, ChannelUser } from "@prisma/client";

export class CreateChannelDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsOptional()
	lastMessage?: Date;

	@IsNotEmpty()
	type: ChannelType;

	@IsString()
	@IsOptional()
	password?: string;

	@IsNotEmpty()
	users: ChannelUser;
}
