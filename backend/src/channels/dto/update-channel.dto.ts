import { PartialType } from "@nestjs/mapped-types";
import { ChannelBan } from "@prisma/client";
import { CreateChannelDto } from "./create-channel.dto";

export class UpdateChannelDto extends PartialType(CreateChannelDto) {
  id!: string;
  banned?: [ChannelBan];
}
