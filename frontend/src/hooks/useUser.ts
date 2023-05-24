import { useQuery } from "react-query";

import { USER_QUERY_KEY, BASE_URL } from "@/constants";
import type { UserAuth, User } from "@types";

async function fetchUser(): Promise<User | null> {
  const response = await fetch(`${BASE_URL}/auth/user`, {
    credentials: "include",
  });
  if (!response.ok) {
    return null;
  }
  const data: UserAuth = (await response.json()) as UserAuth;
  console.log("🫵🏻 message: ", data.message);

  return data.user;
}

interface IUseUser {
  user: User | null;
}

export function useUser(): IUseUser {
  const { data: user } = useQuery<User | null>([USER_QUERY_KEY], async (): Promise<User | null> => fetchUser(), {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    user: user ?? null,
  };
}
