export interface UserAuth {
  message: string;
  user: User;
}

export type UserStatus = "ONLINE" | "OFFLINE" | "IN_GAME";

export type User = {
  id: string;
  name: string;
  avatar: string | null;
  status: UserStatus;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
  blocked: {
    blockedUserId: string;
  }[];
  addedBy: {
    userId: string;
  }[];
};
