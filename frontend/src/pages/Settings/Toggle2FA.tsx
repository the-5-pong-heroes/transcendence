import React from "react";

import "./Toggle2FA.css";
import { customFetch, ResponseError } from "@/helpers";
import { useAppContext } from "@hooks";

export const Toggle2FA: React.FC = () => {
  const { twoFA, toggleTwoFA } = useAppContext();

  const onClick = (): void => {
    toggleTwoFA();
    customFetch("PUT", "auth/twoFAtoggle", { isToggled: !twoFA }).catch((error) => {
      // throw new ResponseError("Fetch request failed", error);
      console.log(error);
    });
  };

  return (
    <label className="toggle-btn">
      <input type="checkbox" checked={twoFA} onChange={onClick} />
      <span />
      <strong>2FA</strong>
    </label>
  );
};
