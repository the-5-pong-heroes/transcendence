import { IsString, IsNotEmpty, IsOptional } from "class-validator";
import { ChannelType, ChannelUser } from "@prisma/client";

const types = ["PRIVATE", "PUBLIC", "PROTECTED", "DIRECT"] as const;

export class CreateChannelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  lastMessage?: Date;

  @IsNotEmpty()
  type: ChannelType;

  @IsString()
  @IsOptional()
  password?: string;

  @IsNotEmpty()
  users: ChannelUser;
}
