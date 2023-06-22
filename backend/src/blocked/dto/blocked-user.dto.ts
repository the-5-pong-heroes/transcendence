import { IsString, IsNotEmpty, IsBoolean } from "class-validator";

export class BlockedUserDto {
  @IsString()
  @IsNotEmpty()
  blockedUserId: string;

  @IsBoolean()
  toBlock: boolean;
}
