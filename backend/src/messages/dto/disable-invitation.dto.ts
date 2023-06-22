import { IsString, IsNotEmpty } from "class-validator";

export class DisableInvitationDto {
  @IsString()
  @IsNotEmpty()
  messageId: string;

  @IsString()
  @IsNotEmpty()
  channelId: string;
}
