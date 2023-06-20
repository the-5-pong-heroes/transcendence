export interface IMessage {
  id: string;
  content: string;
  channelId: string;
  senderId?: string;
  sender?: {
    name: string;
    avatar?: string;
  };
}
