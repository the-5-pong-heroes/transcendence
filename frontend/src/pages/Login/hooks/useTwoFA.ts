import { useQueryClient, type UseMutateFunction, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { ResponseError, type ErrorMessage, customFetch } from "@/helpers";
import { USER_QUERY_KEY } from "@/constants";
import type { UserAuth, User } from "@types";

async function verifyTwoFA(): Promise<User> {
  const response = await customFetch("get", "auth/2FA/verify");
  // TODO maybe send the code to backend here ?
  // const response = await customFetch("post", "auth/2FA/verify", { code: code });
  if (!response.ok) {
    const { message } = (await response.json()) as ErrorMessage;
    throw new ResponseError(message ? message : "Fetch request failed", response);
  }
  const payload = (await response.json()) as UserAuth;
  console.log("payload: ", payload);

  return payload.user;
}

type IUseTwoFA = UseMutateFunction<User>;

export function useTwoFA(): IUseTwoFA {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: logInMutation } = useMutation<User>(() => verifyTwoFA(), {
    onSuccess: (data) => {
      queryClient.setQueryData([USER_QUERY_KEY], data);
      toast.success("🎉 Signed in successfully!");
      navigate("/");
    },
    onError: (error) => {
      if (error instanceof ResponseError) {
        toast.error(`Ops.. ${error.message}. Try again!`);
      } else {
        toast.error(`Ops.. Error on 2FA. Try again!`);
      }
    },
  });

  return logInMutation;
}
