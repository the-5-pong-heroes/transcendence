import { useQueryClient, type UseMutateFunction, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { ResponseError } from "@/helpers";
import { USER_QUERY_KEY } from "@/constants";
import type { UserAuth, User } from "@types";
import * as fetch from "@/helpers/fetch";

type SignUpBody = {
  name: string;
  email: string;
  password: string;
};

interface ErrorMessage {
  message: string;
}

async function signUp(name: string, email: string, password: string): Promise<User> {
  const signUpBody = {
    name: name,
    email: email,
    password: password,
  };
  const data = await fetch.post<SignUpBody, UserAuth>("/auth/signup", signUpBody);

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