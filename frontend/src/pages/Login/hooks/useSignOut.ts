import { useQueryClient, type UseMutateFunction, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { USER_QUERY_KEY } from "@/constants";
import { ResponseError } from "@/helpers";
import * as fetch from "@/helpers/fetch";

interface Message {
  message: string;
}

async function signOut(): Promise<void> {
  const { message } = await fetch.get<Message>("/auth/signout");
}

type IUseSignOut = UseMutateFunction<void>;

export function useSignOut(): IUseSignOut {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: signOutMutation } = useMutation<void>(() => signOut(), {
    onSuccess: () => {
      queryClient.setQueryData([USER_QUERY_KEY], null);
      queryClient.clear();
      window.parent.postMessage({ event: "logout" }, "*");
      navigate("/Login");
      toast.success("Signed out successfully!");
    },
    onError: (error) => {
      if (error instanceof ResponseError) {
        toast.error(`Ops.. ${error.message}. Try again!`);
      } else {
        toast.error(`Ops.. Error on sign out. Try again!`);
      }
    },
  });

  return signOutMutation;
}
