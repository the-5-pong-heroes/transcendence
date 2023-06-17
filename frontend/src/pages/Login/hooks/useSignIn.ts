import { useQueryClient, type UseMutateFunction, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { ResponseError, type ErrorMessage, customFetch } from "@/helpers";
import { USER_QUERY_KEY } from "@/constants";
import type { UserAuth, User } from "@types";

async function signIn(email: string, password: string): Promise<User> {
  const signInBody = {
    email: email,
    password: password,
  };
  const response = await customFetch("post", "auth/signin", signInBody);
  if (!response.ok) {
    const { message } = (await response.json()) as ErrorMessage;
    throw new ResponseError(message ? message : "Fetch request failed", response);
  }
  const payload = (await response.json()) as UserAuth;
  console.log("twoFA: ", payload.twoFA);

  return payload.user;
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
          toast.error(`Ops.. ${error.message}. Try again!`);
        } else {
          toast.error(`Ops.. Error on sign in. Try again!`);
        }
      },
    }
  );

  return signInMutation;
}
