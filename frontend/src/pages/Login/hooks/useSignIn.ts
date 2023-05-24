import { useQueryClient, type UseMutateFunction, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { ResponseError } from "@/helpers";
import { USER_QUERY_KEY, BASE_URL } from "@/constants";
import type { UserAuth, User } from "@types";

interface ErrorMessage {
  message: string;
}

async function signIn(email: string, password: string): Promise<User> {
  const response = await fetch(`${BASE_URL}/auth/signin`, {
    method: "POST",
    credentials: "include",
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
  console.log("🫵🏻 message: ", data.message);

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
        console.log("🫴🏻 data: ", data);
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
