import React, {useEffect, useState} from "react";


import { CLIENT_URL, BASE_URL, API42_URL, API42_CLIENT_ID, API42_REDIRECT } from "@/constants";
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
  
  useEffect(() => {
    console.log("api = ", url_42_auth);
  }, []);

  return (
    <a className="Login_with" href={url_42_auth}>
      <span>Continue with </span>
      <img id="logo-42" alt="42 Logo" src={Logo_42} />      
    </a>
  );
};

export const Login: React.FC = () => {
  const [isActivated, setIsActivated] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchToggle2FA = async () => {
      const toggledValue = await twoFAstatus();
      setIsActivated(toggledValue);
    };

    fetchToggle2FA();
  }, []);

  async function twoFAstatus(): Promise<boolean> {
    try {
      const response = await customFetch("GET", "auth/2FA/status");
      if (response.ok) {
        const data = await response.json();
        if (data.twoFA === true)
          return true;
      }
      else
        return false;
    }
    catch (error) {
      console.log("status 2FA not updated")
    }
    return false;
  }

  async function submitVerificationCode(e:any) {
    e.preventDefault();
    const twoFACode = e.target.verificationCode.value;
    console.log("twoFAcode = ",twoFACode);
    const response = await customFetch("POST", "auth/2FA/verify", { twoFACode: twoFACode });
    if (response.ok) {
      alert("Code de vérification correct !");
      window.open(CLIENT_URL, "_self");
    } else {
      alert("Code de vérification incorrect. Veuillez réessayer.");
    }
    }

  return (
    isActivated === false ?
    <div className="Login">
      <form className="form" onSubmit={submitVerificationCode}>
        <div className="popup-content">
          <p>Please enter the verification code sent to your email:</p>
          <input type="number" name="verificationCode" style={{ color: "black" }} />
          <button type="submit"> Valider</button>
        </div>
      </form>
    </div>
    :
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
