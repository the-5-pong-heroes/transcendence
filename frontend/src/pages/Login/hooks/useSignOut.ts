import { useQueryClient, type UseMutateFunction, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { USER_QUERY_KEY, BASE_URL } from "@/constants";
import { ResponseError } from "@/helpers";

interface Message {
  message: string;
}

async function signOut(): Promise<void> {
  const response = await fetch(`${BASE_URL}/auth/signout`, {
    credentials: "include",
    mode: "cors",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
  if (!response.ok) {
    const { message } = (await response.json()) as Message;
    throw new ResponseError(message, response);
  }
  const data: Message = (await response.json()) as Message;
  console.log("🫵🏻 message: ", data.message);
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
        toast.error(`Ops.. Error on sign in. Try again!`);
      }
    },
  });

  return signOutMutation;
}
