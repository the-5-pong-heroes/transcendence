import { ChannelType, ChannelUser } from "@prisma/client";
import { IsString, IsNotEmpty, IsDate, IsOptional, IsIn } from "class-validator";

const types = ["PRIVATE", "PUBLIC", "PROTECTED", "DIRECT"] as const;

export class CreateChannelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsDate()
  lastMessage?: Date;

  @IsIn(types)
  @IsNotEmpty()
  type: ChannelType;

  @IsString()
  @IsOptional()
  password?: string;

  @IsNotEmpty()
  users: ChannelUser;
}
