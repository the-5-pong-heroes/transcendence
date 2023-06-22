import { User } from "@prisma/client";

export interface User42Infos {
  email: string;
  login: string;
  id: string;
}

export interface UserAuth {
  message: string;
  user: User | null;
}
