import { PartialType } from "@nestjs/swagger";
import { ChannelBan } from "@prisma/client";
import { CreateChannelDto } from "./create-channel.dto";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateChannelDto extends PartialType(CreateChannelDto) {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsOptional()
  banned?: [ChannelBan];
}
