import { PartialType } from "@nestjs/swagger";
import { ChannelBan } from "@prisma/client";
import { CreateChannelDto } from "./create-channel.dto";

export class UpdateChannelDto extends PartialType(CreateChannelDto) {
  id: string;
  banned?: [ChannelBan];
}
