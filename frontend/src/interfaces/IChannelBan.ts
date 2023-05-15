export interface IChannelBan {
  id: string;
  user: {
    id: string;
    name: string;
  };
  bannedUntil: Date;
}
