import { IsString, IsNotEmpty } from "class-validator";

export class UnbanChannelUserDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  channelId: string;
}
