import { IsString, IsBoolean, IsNotEmpty } from "class-validator";

export class BlockedUserDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  blockedUserId: string;

  @IsBoolean()
  @IsNotEmpty()
  toBlock: boolean;
}
