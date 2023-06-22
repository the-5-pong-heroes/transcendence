import { IsString, IsNotEmpty } from "class-validator";

export class SubmitPasswordDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  channelId: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
