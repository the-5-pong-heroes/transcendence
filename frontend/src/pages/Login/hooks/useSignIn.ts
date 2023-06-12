import { useQueryClient, type UseMutateFunction, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { ResponseError, customFetch } from "@/helpers";
import { USER_QUERY_KEY } from "@/constants";
import type { UserAuth, User } from "@types";
// import * as fetch from "@/helpers/customFetch";

type SignInBody = {
  email: string;
  password: string;
};

async function signIn(email: string, password: string): Promise<User> {
  const signInBody: SignInBody = {
    email: email,
    password: password,
  };
  // const data = await fetch.post<SignInBody, UserAuth>("/auth/signin", signInBody);
  const data = await customFetch<UserAuth>("POST", "/auth/signin", signInBody);
  // const data = await customFetch<UserAuth, SignInBody>("post", "/auth/signin", signInBody);

  return data.user;
}

type IUseSignIn = UseMutateFunction<
  User,
  unknown,
  {
    email: string;
    password: string;
  }
>;

export function useSignIn(): IUseSignIn {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: signInMutation } = useMutation<User, unknown, { email: string; password: string }>(
    ({ email, password }) => signIn(email, password),
    {
      onSuccess: (data) => {
        queryClient.setQueryData([USER_QUERY_KEY], data);
        toast.success("🎉 Signed in successfully!");
        navigate("/");
      },
      onError: (error) => {
        if (error instanceof ResponseError) {
          toast.error(`Oops.. ${error.message}. Try again!`);
        } else {
          toast.error(`Oops.. Error on sign in. Try again!`);
        }
      },
    }
  );

  return signInMutation;
}
