import { IMessage } from "./IMessage";
import { IChannelUser } from "./IChannelUser"
import { IChannelBan } from "./IChannelBan";

export interface IChannel {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  lastMessage: string;
  password?: string;
  messages?: [IMessage]
  users: [IChannelUser]
  banned: [IChannelBan]
}
