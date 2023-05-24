import { useQuery } from "react-query";

import { USERS_QUERY_KEY, BASE_URL } from "@/constants";
import type { User } from "@types";
import { ResponseError } from "@/helpers";

async function fetchUsers(): Promise<User[]> {
  const response = await fetch(`${BASE_URL}/users`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new ResponseError("Failed on get user request", response);
  }
  const data: User[] = (await response.json()) as User[];

  return data;
}

interface IUseUser {
  users: User[] | undefined;
  status: "error" | "idle" | "loading" | "success";
}

export function useUsers(): IUseUser {
  const { data, status } = useQuery<User[]>(USERS_QUERY_KEY, async (): Promise<User[]> => fetchUsers(), {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    users: data,
    status: status,
  };
}
