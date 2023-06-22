export class CreateMessageDto {
  content: string;
  senderId?: string;
  channelId: string;
}
