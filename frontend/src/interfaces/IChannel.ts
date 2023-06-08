import { type IMessage } from "./IMessage";
import { type IChannelUser } from "./IChannelUser";
import { type IChannelBan } from "./IChannelBan";

export interface IChannel {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  lastMessage: string;
  password?: string;
  messages?: [IMessage];
  users: [IChannelUser];
  banned: [IChannelBan];
}
