import { IsString, IsNotEmpty } from "class-validator";

export class ChannelUserIdDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
