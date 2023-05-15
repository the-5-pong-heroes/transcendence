import { ChannelType, ChannelUser } from "@prisma/client";

export class CreateChannelDto {
  name!: string;
  lastMessage?: Date;
  type!: ChannelType;
  password?: string;
  users!: ChannelUser;
}
