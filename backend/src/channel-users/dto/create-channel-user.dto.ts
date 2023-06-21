import { IsString, IsBoolean, IsOptional, IsNotEmpty } from "class-validator";

export class CreateChannelUserDto {
  @IsString()
  @IsNotEmpty()
  channelId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsBoolean()
  @IsOptional()
  isAuthorized?: boolean;
}
