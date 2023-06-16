import React, { useState } from "react";
import { useQuery } from "react-query";

import "./Toggle2FA.css";
import { customFetch, ResponseError } from "@/helpers";

interface TwoFAactivated {
  twoFAactivated: boolean;
}

async function fetch2FAactivated(): Promise<boolean> {
  const response = await customFetch("get", "auth/twoFAactivated");
  if (!response.ok) {
    throw new ResponseError("Fetch request failed", response);
  }
  const payload = (await response.json()) as TwoFAactivated;

  return payload.twoFAactivated;
}

interface ITwoFA {
  twoFAactivated?: boolean;
}

export function useTwoFAQuery(): ITwoFA {
  const { data: twoFAactivated } = useQuery<boolean>(
    ["USER_QUERY_KEY"],
    async (): Promise<boolean> => fetch2FAactivated(),
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  return { twoFAactivated: twoFAactivated };
}

export const Toggle2FA: React.FC = () => {
  const { twoFAactivated } = useTwoFAQuery();
  const [isToggled, toggle] = useState<boolean>(twoFAactivated);

  const onClick = (): void => {
    toggle(!isToggled);
    customFetch("put", "auth/twoFAtoggle", { isToggled: isToggled }).catch((error) => {
      // throw new ResponseError("Fetch request failed", error);
      console.log(error);
    });
  };

  return (
    <label className="toggle-btn">
      <input type="checkbox" defaultChecked={isToggled} onClick={onClick} />
      <span />
      <strong>2FA</strong>
    </label>
  );
};
