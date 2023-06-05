export interface IUser {
  id: string;
  name: string;
<<<<<<< HEAD
=======
  avatar?: string;
  blocked: {
    blockedUserId: string;
  }[];
  addedBy: {
    userId: string;
  }[];
>>>>>>> master
}
