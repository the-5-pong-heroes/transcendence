import { useQueryClient, type UseMutateFunction, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { ResponseError } from "@/helpers";
import { USER_QUERY_KEY } from "@/constants";
import type { UserAuth } from "@types";

interface ErrorMessage {
  message: string;
}

async function signIn(email: string, password: string): Promise<UserAuth> {
  const response = await fetch("http://localhost:3000/auth/signin", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const { message } = (await response.json()) as ErrorMessage;
    throw new ResponseError(message, response);
  }
  const data: UserAuth = (await response.json()) as UserAuth;

  return data;
}

type IUseSignIn = UseMutateFunction<
  UserAuth,
  unknown,
  {
    email: string;
    password: string;
  }
>;

export function useSignIn(): IUseSignIn {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: signInMutation } = useMutation<UserAuth, unknown, { email: string; password: string }>(
    ({ email, password }) => signIn(email, password),
    {
      onSuccess: (data) => {
        queryClient.setQueryData([USER_QUERY_KEY], data);
        toast.success("🎉 Signed in successfully!");
        navigate("/");
      },
      onError: (error) => {
        if (error instanceof ResponseError) {
          toast.error(`Ops.. ${error.message}. Try again!`);
        } else {
          toast.error(`Ops.. Error on sign in. Try again!`);
        }
      },
    }
  );

  return signInMutation;
}
