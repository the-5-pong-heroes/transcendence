import React, { useEffect, useState } from "react";

import "./Toggle2FA.css";

import { customFetch } from "@/helpers";

export const Toggle2FA: React.FC = () => {
  const [isActivated, setIsActivated] = useState<boolean>(false);

  useEffect(() => {
    const fetchToggle2FA = async () => {
      const toggledValue = await handletoggle2FA();
      setIsActivated(toggledValue);
    };

    fetchToggle2FA();
  }, []);

  async function handletoggle2FA(): Promise<boolean> {
    const response = await customFetch("GET", "auth/2FA/status");
    if (response.ok) {
      const data = await response.json();
      if (data.twoFA === true) {
        return true;
      }
    }

    return false;
  }

  async function toggle2FA() {
    if (isActivated) {
      const response = await customFetch("GET", "auth/2FA/disable");
    } else {
      const response = await customFetch("GET", "auth/2FA/generate");
    }
    setIsActivated(!isActivated);
  }

  useEffect(() => {}, [isActivated]);

  return (
    <label className="toggle-btn">
      <input type="checkbox" checked={isActivated} onChange={toggle2FA} />
      <span />
      <strong>2FA</strong>
    </label>
  );
};
