import { IsString, IsNotEmpty } from "class-validator";

export class CreateDirectChannelDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  channelId: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  constructor() {
    this.type = "DIRECT";
  }
}
