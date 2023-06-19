import React, { useEffect, useState } from "react";
import { useUser } from "@/hooks";
import "./Toggle2FA.css";

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
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}` + "/auth/Oauth42/login", {
      method: "POST", //mettre un GET
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: user }),
    });
    const data = await response.json();
    console.log("auth= ", data.auth);
    if (data.auth.twoFAactivated === true) {
      return true;
    } else {
      return false;
    }
  }

  async function toggle2FA() {
    if (isActivated === true)
    {
      const url = `${import.meta.env.VITE_BACKEND_URL}` + "/auth/2FA/disable";
      window.open(url, "_self");
    }
    else{
      const url = `${import.meta.env.VITE_BACKEND_URL}` + "/auth/2FA/generate";
      window.open(url, "_self");
    }
    setIsActivated(!isActivated);
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
