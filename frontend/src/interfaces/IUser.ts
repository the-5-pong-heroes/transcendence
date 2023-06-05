export interface IUser {
  id: string;
  name: string;
  avatar?: string;
  blocked: {
    blockedUserId: string;
  }[];
  addedBy: {
    userId: string;
  }[];
}
