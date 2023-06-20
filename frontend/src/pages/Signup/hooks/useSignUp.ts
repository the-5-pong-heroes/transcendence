import { useQueryClient, type UseMutateFunction, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { ResponseError, type ErrorMessage, customFetch } from "@/helpers";
import { USER_QUERY_KEY } from "@/constants";
import type { UserAuth, User } from "@types";

async function signUp(name: string, email: string, password: string): Promise<User> {
  const signUpBody = {
    name: name,
    email: email,
    password: password,
  };
  const response = await customFetch("POST", "auth/signup", signUpBody);
  if (!response.ok) {
    const { message } = (await response.json()) as ErrorMessage;
    throw new ResponseError(message ? message : "Fetch request failed", response);
  }
  const payload = (await response.json()) as UserAuth;

  return payload.user;
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
          toast.error(`Oops.. ${error.message}. Try again!`);
        } else {
          toast.error(`Oops.. Error on sign up. Try again!`);
        }
      },
    }
  );

  return signUpMutation;
}
