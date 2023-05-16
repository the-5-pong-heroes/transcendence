import { useEffect } from "react";
import { useQueryClient } from "react-query";

import * as userLocalStorage from "@/helpers/localStorage";
import { USER_QUERY_KEY } from "@/constants";

export const useLocalStorageChange = (): void => {
  const queryClient = useQueryClient();
  const savedUser = userLocalStorage.getUser();

  useEffect(() => {
    const handleStorage = (): void => {
      const newUser = userLocalStorage.getUser();
      if (JSON.stringify(savedUser) !== JSON.stringify(newUser)) {
        if (!newUser || newUser === undefined) {
          queryClient.setQueryData([USER_QUERY_KEY], null);
        } else {
          queryClient.setQueryData([USER_QUERY_KEY], newUser);
        }
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
  }, [savedUser, queryClient]);
};
