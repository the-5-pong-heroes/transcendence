export interface IChannelUser {
  id: string;
  role: string;
  isAuthorized?: boolean;
  isMuted: boolean;
  user: {
    id: string;
    name: string;
  };
}
