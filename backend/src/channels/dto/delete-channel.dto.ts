import { IsString, IsNotEmpty } from "class-validator";

export class DeleteChannelDto {
  @IsString()
  @IsNotEmpty()
  channelId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
