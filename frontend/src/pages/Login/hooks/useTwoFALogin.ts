import { useQueryClient, type UseMutateFunction, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { ResponseError, type ErrorMessage, customFetch } from "@/helpers";
import { USER_QUERY_KEY } from "@/constants";
import type { UserAuth, User } from "@types";

async function verifyTwoFA(code: string): Promise<User> {
  const response = await customFetch("POST", "auth/2FA/verify", { code: code });
  if (!response.ok) {
    const { message } = (await response.json()) as ErrorMessage;
    throw new ResponseError(message ? message : "Fetch request failed", response);
  }
  const payload = (await response.json()) as UserAuth;
  // console.log("payload: ", payload);

  return payload.user;
}

type IUseTwoFA = UseMutateFunction<
  User | null,
  unknown,
  {
    code: string;
  }
>;

export function useTwoFALogin(): IUseTwoFA {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: logInMutation } = useMutation<User | null, unknown, { code: string }>(
    ({ code }) => verifyTwoFA(code),
    {
      onSuccess: (data) => {
        queryClient.setQueryData([USER_QUERY_KEY], data);
        toast.success("🎉 Signed in successfully!");
        navigate("/");
      },
      onError: (error) => {
        if (error instanceof ResponseError) {
          toast.error(`Ops.. ${error.message} Try again!`);
        } else {
          toast.error(`Ops.. Error on 2FA. Try again!`);
        }
      },
    }
  );

  return logInMutation;
}
