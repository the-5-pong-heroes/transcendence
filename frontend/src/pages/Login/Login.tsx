import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useSignIn, useTwoFALogin } from "./hooks";

import { BASE_URL, API42_URL, API42_CLIENT_ID, API42_REDIRECT } from "@/constants";
import { Logo_42, Logo_Google, Logo_Eve } from "@assets";
import { customFetch } from "@/helpers";

import "./Login.css";

interface TwoFAStatus {
  twoFA: boolean;
}

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

export const LoginGoogle: React.FC = () => {
  const handleOnClick = (): void => {
    const url = `${BASE_URL}/auth/google`;
    window.open(url, "_self");
  };

  return (
    <div className="Login_with" onClick={handleOnClick}>
      <span>Continue with</span>
      <img id="logo-Google" alt="Google Logo" src={Logo_Google} />
    </div>
  );
};

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const signIn = useSignIn();
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
      const data = (await response.json()) as TwoFAStatus;

      return data.twoFA;
    } catch (error) {
      console.error(error);
    }

    return false;
  }

  const onSignIn: React.FormEventHandler<HTMLFormElement> = (form) => {
    form.preventDefault();
    const formData = new FormData(form.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email === "string" && typeof password === "string") {
      signIn({
        email,
        password,
      });
    }
  };

  function submitVerificationCode(): void {
    const popup = document.getElementById("verificationCode");
    if (popup instanceof HTMLInputElement) {
      const twoFACode = popup.value;
      twoFALogin({ code: twoFACode });
      // const response = await customFetch("POST", "auth/2FA/verify", { code: twoFACode });
      // if (response.ok) {
      //   alert("Code de vérification correct !");
      //   window.open(CLIENT_URL, "_self");
      // } else {
      //   alert("Code de vérification incorrect. Veuillez réessayer.");
      // }
    }
  }

  return (
    <div className="Login">
      <form className="form" onSubmit={onSignIn}>
        <img id="login-robot" src={Logo_Eve} />
        <input className="input" type="text" name="email" placeholder="Email" required />
        <input className="input" type="password" name="password" placeholder="Password" required />
        <div className="form-sign">
          <input className="submit" type="submit" value="Sign in" />
          <button className="login-link" onClick={() => navigate("/Signup")}>
            Sign up
          </button>
        </div>
        {!isActivated ? (
          <div className="continue-with" id="continue-with">
            <Login42 />
            <LoginGoogle />
          </div>
        ) : (
          <div id="popup">
            <div className="popup-modal">
              <div className="popup-content">
                <p>Please enter the verification code sent to your email:</p>
                <input type="text" id="verificationCode" style={{ color: "black" }} />
                <button onClick={submitVerificationCode}> Valider</button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
