import { useEffect } from "react";
import { useQuery } from "react-query";

import { ResponseError } from "../helpers";
import * as userLocalStorage from "../helpers/localStorage";

import { USER_QUERY_KEY } from "@/constants";
import type { UserAuth } from "@types";

async function fetchUser(userAuth: UserAuth | null | undefined): Promise<UserAuth | null> {
  if (!userAuth) {
    return null;
  }
  const response = await fetch(`http://localhost:3000/users/${userAuth.user.id}`, {
    headers: {
      Authorization: `Bearer ${userAuth.accessToken}`,
    },
  });
  if (!response.ok) {
    throw new ResponseError("Failed on get user request", response);
  }
  const data: UserAuth = (await response.json()) as UserAuth;

  return data;
}

interface IUseUser {
  userAuth: UserAuth | null;
}

export function useUser(): IUseUser {
  const { data: userAuth } = useQuery<UserAuth | null>(
    [USER_QUERY_KEY],
    async (): Promise<UserAuth | null> => fetchUser(userAuth),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      initialData: userLocalStorage.getUser,
      onError: () => {
        userLocalStorage.removeUser();
      },
    }
  );

  useEffect(() => {
    if (!userAuth) {
      userLocalStorage.removeUser();
    } else {
      userLocalStorage.saveUser(userAuth);
    }
  }, [userAuth]);

  return {
    userAuth: userAuth ?? null,
  };
}
