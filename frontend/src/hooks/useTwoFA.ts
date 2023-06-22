import { useState } from "react";
import { useQuery } from "react-query";

import { customFetch, ResponseError } from "@/helpers";

const USER_QUERY_KEY_2FA = "USER_QUERY_KEY_2FA";

interface TwoFAactivated {
  twoFAactivated: boolean;
}

async function fetch2FAactivated(): Promise<boolean> {
  const response = await customFetch("GET", "auth/twoFAactivated");
  if (!response.ok) {
    throw new ResponseError("Fetch request failed", response);
  }
  const payload = (await response.json()) as TwoFAactivated;

  return payload.twoFAactivated;
}

interface ITwoFA {
  twoFA: boolean;
  setTwoFA: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

export function useTwoFA(): ITwoFA {
  const [twoFA, setTwoFA] = useState<boolean>();
  // useQuery<boolean>([USER_QUERY_KEY_2FA], async (): Promise<boolean> => fetch2FAactivated(), {
  //   // refetchOnMount: false,
  //   refetchOnReconnect: false,
  //   refetchOnWindowFocus: false,
  //   onSuccess: (data) => {
  //     setTwoFA(data);
  //   },
  // });

  return {
    twoFA: twoFA ?? false,
    setTwoFA: setTwoFA,
  };
}
