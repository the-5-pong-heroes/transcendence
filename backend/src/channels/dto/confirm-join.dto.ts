import { IsString, IsNotEmpty } from 'class-validator';

export class ConfirmJoinDto {
	@IsString()
	@IsNotEmpty()
	channelId: string;

	@IsString()
	@IsNotEmpty()
	userId: string;
}
