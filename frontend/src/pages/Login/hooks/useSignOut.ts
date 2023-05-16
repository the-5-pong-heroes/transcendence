import { useCallback } from "react";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import * as userLocalStorage from "@/helpers/localStorage";
import { USER_QUERY_KEY } from "@/constants";

type IUseSignOut = () => void;

export function useSignOut(): IUseSignOut {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const onSignOut = useCallback(() => {
    queryClient.setQueryData([USER_QUERY_KEY], null);
    queryClient.clear();
    userLocalStorage.removeUser();
    navigate("/Login");
    toast.success("Signed out successfully!");
  }, [navigate, queryClient]);

  return onSignOut;
}
