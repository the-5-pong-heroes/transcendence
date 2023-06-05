<<<<<<< HEAD
import { type IMessage } from "./IMessage";
import { type IChannelUser } from "./IChannelUser";
import { type IChannelBan } from "./IChannelBan";
=======
import { IMessage } from "./IMessage";
import { IChannelUser } from "./IChannelUser"
import { IChannelBan } from "./IChannelBan";
>>>>>>> master

export interface IChannel {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  lastMessage: string;
  password?: string;
<<<<<<< HEAD
  messages?: [IMessage];
  users: [IChannelUser];
  banned: [IChannelBan];
=======
  messages?: [IMessage]
  users: [IChannelUser]
  banned: [IChannelBan]
>>>>>>> master
}
