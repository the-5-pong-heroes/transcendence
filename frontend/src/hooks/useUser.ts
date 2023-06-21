import { useQuery } from "react-query";

import { USER_QUERY_KEY } from "@/constants";
import type { UserAuth, User } from "@types";
import { customFetch } from "@/helpers";

async function fetchUser(): Promise<User | null> {
  const response = await customFetch("GET", "auth/user");
  const payload = await response.json();

  return payload.user;
}

interface IUseUser {
  user: User | null;
  isLoading: boolean;
}

export function useUserQuery(): IUseUser {
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

export function useUser(): User | null {
  const { user } = useUserQuery();

  return user;
}
