import { useQuery } from "react-query";

import { USERS_QUERY_KEY } from "@/constants";
import type { User } from "@types";
import * as fetch from "@/helpers/fetch";

async function fetchUsers(): Promise<User[]> {
  const data = await fetch.get<User[]>("/users");

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
