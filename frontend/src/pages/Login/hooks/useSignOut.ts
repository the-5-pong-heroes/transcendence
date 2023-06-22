import { useQueryClient, type UseMutateFunction, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { USER_QUERY_KEY } from "@/constants";
import { ResponseError, type ErrorMessage, customFetch } from "@/helpers";

interface Message {
  message: string;
}

async function signOut(): Promise<void> {
  const response = await customFetch("GET", "auth/signout");
  if (!response.ok) {
    const { message } = (await response.json()) as ErrorMessage;
    throw new ResponseError(message ? message : "Fetch request failed", response);
  }
  const payload = (await response.json()) as Message;
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
        toast.error(`Oops.. ${error.message}. Try again!`);
      } else {
        toast.error(`Oops.. Error on sign out. Try again!`);
      }
    },
  });

  return signOutMutation;
}
