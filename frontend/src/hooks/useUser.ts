import { useQuery } from "react-query";

import { USER_QUERY_KEY } from "@/constants";
import type { UserAuth, User } from "@types";
import * as fetch from "@/helpers/fetch";

async function fetchUser(): Promise<User | null> {
  const data = await fetch.get<UserAuth>("/auth/user");
  console.log("🐥");

  return data.user;
}

interface IUseUser {
  user: User | null;
  isLoading: boolean;
}

export function useUser(): IUseUser {
  const { data: user, isLoading } = useQuery<User | null>(
    [USER_QUERY_KEY],
    async (): Promise<User | null> => fetchUser(),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  return {
    user: user ?? null,
    isLoading: isLoading,
  };
}
