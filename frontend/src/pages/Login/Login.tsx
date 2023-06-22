import React, { useEffect, useState } from "react";

import { useTwoFALogin } from "./hooks";

import { API42_URL, API42_CLIENT_ID, API42_REDIRECT } from "@/constants";
import { Logo_42, Logo_Eve } from "@assets";
import "./Login.css";
import { customFetch } from "@/helpers";

export const Login42: React.FC = () => {
  const body = {
    client_id: API42_CLIENT_ID,
    redirect_uri: API42_REDIRECT,
    response_type: "code",
    scope: "public",
  };
  const url_42_auth = API42_URL + "?" + new URLSearchParams(body).toString();

  return (
    <a className="Login_with" href={url_42_auth}>
      <span>Continue with </span>
      <img id="logo-42" alt="42 Logo" src={Logo_42} />
    </a>
  );
};

export const Login: React.FC = () => {
  const twoFALogin = useTwoFALogin();
  const [isActivated, setIsActivated] = useState<boolean>(false);

  useEffect(() => {
    const fetchToggle2FA = async (): Promise<void> => {
      const toggledValue = await twoFAstatus();
      setIsActivated(toggledValue);
    };

    fetchToggle2FA().catch(() => console.log());
  }, []);

  async function twoFAstatus(): Promise<boolean> {
    try {
      const response = await customFetch("GET", "auth/2FA/status");
      if (response.ok) {
        const data = (await response.json()) as { twoFA: boolean };
        if (data.twoFA) {
          return true;
        }
      } else {
        return false;
      }
    } catch (error) {
      console.error("status 2FA not updated");
    }

    return false;
  }

  async function submitVerificationCode(e: any): Promise<void> {
    e.preventDefault();
    const code = e.target.verificationCode.value;
    twoFALogin({ code: code });
  }

  return isActivated ? (
    <div className="Login">
      <form className="form" onSubmit={submitVerificationCode}>
        <div className="popup-content">
          <p>Please enter the verification code sent to your email:</p>
          <input type="number" name="verificationCode" style={{ color: "black" }} />
          <button type="submit"> Valider</button>
        </div>
      </form>
    </div>
  ) : (
    <div className="Login">
      <form className="form">
        <img id="login-robot" src={Logo_Eve} />
        <div className="continue-with">
          <Login42 />
        </div>
      </form>
    </div>
  );
};
