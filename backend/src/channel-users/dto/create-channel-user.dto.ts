import { IsString, IsNotEmpty } from "class-validator";

export class CreateChannelUserDto {
  @IsString()
  @IsNotEmpty()
  channelId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
