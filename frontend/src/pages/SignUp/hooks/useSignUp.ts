import { useQueryClient, type UseMutateFunction, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { ResponseError } from "@/helpers";
import { USER_QUERY_KEY, BASE_URL } from "@/constants";
import type { UserAuth, User } from "@types";

interface ErrorMessage {
  message: string;
}

async function signUp(name: string, email: string, password: string): Promise<User> {
  const response = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    credentials: "include",
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
  console.log("🫵🏻 message: ", data.message);

  return data.user;
}

type IUseSignUp = UseMutateFunction<
  User,
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

  const { mutate: signUpMutation } = useMutation<User, unknown, { name: string; email: string; password: string }>(
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
