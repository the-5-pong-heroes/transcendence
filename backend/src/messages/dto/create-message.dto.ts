import { IsString, IsNotEmpty, MaxLength, IsOptional } from "class-validator";

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1024)
  content: string;

  @IsString()
  @IsOptional()
  senderId?: string;

  @IsString()
  @IsNotEmpty()
  channelId: string;
}
