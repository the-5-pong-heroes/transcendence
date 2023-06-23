import { IsString, IsNotEmpty, IsOptional, IsIn, IsDate } from "class-validator";
import { ChannelType, ChannelUser } from "@prisma/client";

const types = ["PRIVATE", "PUBLIC", "PROTECTED", "DIRECT"] as const;

export class CreateChannelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsDate()
  lastMessage?: Date;

  @IsNotEmpty()
  @IsIn(types)
  type: ChannelType;

  @IsString()
  @IsOptional()
  password?: string;

  @IsNotEmpty()
  users: ChannelUser;
}
