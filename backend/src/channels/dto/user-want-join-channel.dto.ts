import { IsString, IsNotEmpty } from "class-validator";

export class UserWantJoinChannelDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  channelId: string;

  @IsString()
  type: string;
}
