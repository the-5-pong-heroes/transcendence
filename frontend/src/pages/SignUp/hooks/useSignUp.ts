import { useQueryClient, type UseMutateFunction, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { ResponseError } from "@/helpers";
import { USER_QUERY_KEY } from "@/constants";
import type { UserAuth } from "@types";

interface ErrorMessage {
  message: string;
}

async function signUp(name: string, email: string, password: string): Promise<UserAuth> {
  const response = await fetch("http://localhost:3000/auth/signup", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({ name, email, password }),
  });
  if (!response.ok) {
    const { message } = (await response.json()) as ErrorMessage;
    throw new ResponseError(message, response);
  }
  const data: UserAuth = (await response.json()) as UserAuth;

  return data;
}

type IUseSignUp = UseMutateFunction<
  UserAuth,
  unknown,
  {
    name: string;
    email: string;
    password: string;
  }
>;

export function useSignUp(): IUseSignUp {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: signUpMutation } = useMutation<UserAuth, unknown, { name: string; email: string; password: string }>(
    ({ name, email, password }) => signUp(name, email, password),
    {
      onSuccess: (data) => {
        queryClient.setQueryData([USER_QUERY_KEY], data);
        navigate("/");
        toast.success("🎉 Signed up successfully!");
      },
      onError: (error) => {
        if (error instanceof ResponseError) {
          toast.error(`Ops.. ${error.message}. Try again!`);
        } else {
          toast.error(`Ops.. Error on sign up. Try again!`);
        }
      },
    }
  );

  return signUpMutation;
}
