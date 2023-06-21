import { IsString, IsNotEmpty } from "class-validator";

export class BanChannelUserDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  bannedUntil: Date;
}
