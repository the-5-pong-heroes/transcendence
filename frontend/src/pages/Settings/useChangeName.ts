import { Dispatch, SetStateAction } from "react";
import { useQueryClient, type UseMutateFunction, useMutation } from "react-query";
import { toast } from "react-toastify";

import { UserSettings } from "./Settings";

import { ResponseError, type ErrorMessage, customFetch } from "@/helpers";
import { USER_QUERY_KEY } from "@/constants";
import type { User } from "@types";

async function changeName(name: string): Promise<User> {
  const response = await customFetch("PATCH", "settings", { name: name });
  if (!response.ok) {
    throw new ResponseError("Your username must be unique and 3 to 20 characters long.", response);
  }
  const payload = await response.json();

  return payload;
}

type IUseTwoFA = UseMutateFunction<
  User | null,
  unknown,
  {
    name: string;
  }
>;

interface SettingsProps {
  settings: UserSettings;
  setSettings: Dispatch<SetStateAction<UserSettings>>;
}

export function useChangeName({ settings, setSettings }: SettingsProps): IUseTwoFA {
  const queryClient = useQueryClient();

  const { mutate: nameMutation } = useMutation<User | null, unknown, { name: string }>(({ name }) => changeName(name), {
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData([USER_QUERY_KEY], data);
        setSettings({ ...settings, name: data?.name });
        toast.success("✨ Name successfully updated!");
      }
    },
    onError: (error) => {
      toast.error("Your username must be unique and 3 to 20 characters long.");
    },
  });

  return nameMutation;
}
