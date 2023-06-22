import { IsString, IsNotEmpty, IsOptional } from "class-validator";
import { ChannelType } from "@prisma/client";

export class UpdateChannelTypeDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  type: ChannelType;

  @IsString()
  @IsOptional()
  password: string;
}
