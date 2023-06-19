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
      console.log("Hello 1");
      const url = `${import.meta.env.VITE_BACKEND_URL}` + "/auth/2FA/disable";
      console.log("Hello 2");
      const response = await customFetch("GET", url );
      console.log("Hello 3");
    }
    else{
      console.log("Hello 1");
      const url = `${import.meta.env.VITE_BACKEND_URL}` + "/auth/2FA/generate";
      console.log("Hello 2");
      const response = await fetch(url);
      console.log("Hello 3");
    }
    console.log("toggle2FA");
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
