import { useQuery } from "react-query";

import { USER_QUERY_KEY } from "@/constants";
import type { UserAuth, User } from "@types";
import { ResponseError, type ErrorMessage, customFetch } from "@/helpers";

async function fetchUser(): Promise<User | null> {
  const response = await customFetch("GET", "auth/user");

  if (!response.ok) {
    const { message } = (await response.json()) as ErrorMessage;
    throw new ResponseError(message ? message : "Fetch request failed", response);
  }
  const payload = (await response.json()) as UserAuth;

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
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
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
