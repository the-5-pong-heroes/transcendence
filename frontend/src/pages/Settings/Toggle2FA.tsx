import React, { useEffect, useState } from "react";
import { useUser } from "@/hooks";
import "./Toggle2FA.css";
import { customFetch } from "../../helpers";

export const Toggle2FA: React.FC = () => {
  const [isActivated, setIsActivated] = useState<boolean>(false);
  
  const user = useUser();
    
  useEffect(() => {
    const fetchToggle2FA = async () => {
      const toggledValue = await handletoggle2FA();
      setIsActivated(toggledValue);
      console.log("toggledValue: ", toggledValue)
    };

    fetchToggle2FA();
  }, []);


  async function handletoggle2FA(): Promise<boolean> {
    const response = await customFetch("GET", "auth/2FA/status");
    if (response.ok) {
      const data = await response.json();
      if (data.twoFA === true)
        return true;
    }
    return false;
    }

  async function toggle2FA() {
    if (isActivated === true)
    {
      const response = await customFetch("GET", "auth/2FA/disable");
      console.log("response: ", response);
    }
    else{
      const response = await customFetch("GET", "auth/2FA/generate");
      console.log("response: ", response);
    }
    console.log("isActivated1: ", isActivated);
    setIsActivated(!isActivated);
    console.log("isActivated2: ", isActivated);
  }

  useEffect(() => {
    console.log("2FA toggled= ", isActivated);
  }, [isActivated])

  return (
    <label className="toggle-btn">
      <input type="checkbox" checked={isActivated} onChange={toggle2FA} />
      <span />
      <strong>2FA</strong>
    </label>
  );
};
