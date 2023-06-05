export interface IMessage {
  content: string;
  channelId: string;
  senderId?: string;
  sender?: {
    name: string;
  }
}
