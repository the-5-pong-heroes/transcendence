import React from "react";
import { useNavigate } from "react-router-dom";

import { useSignIn } from "./hooks";

import { BASE_URL } from "@/constants";
import { Logo_42, Logo_Google, Logo_Eve } from "@assets";
import "./Login.css";
import { customFetch } from "@/helpers";

export const Login42: React.FC = () => {

  const handleAuth42 = () => {
    const url = `${import.meta.env.VITE_API42_URI}`;
    window.open(url, "_self");
  };

  return (
    <div className="Login_with" onClick={handleAuth42}>
      <span>Continue with </span>
      <img id="logo-42" alt="42 Logo" src={Logo_42} />      
    </div>
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
  const queryParams = new URLSearchParams(window.location.search);
  const displayPopup = queryParams.get("displayPopup") === "true";
  const twoFACode = React.useState("");

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

  async function submitVerificationCode() {
      const popup = document.getElementById("verificationCode");
      if (popup instanceof HTMLInputElement) {
        const twoFACode = popup.value;
        console.log("twoFAcode = ",twoFACode);
        const response = await customFetch("POST", "auth/2FA/verify", { twoFACode: twoFACode });
        if (response.ok) {
          alert("Code de vérification correct !");
          const url = `${import.meta.env.VITE_FRONTEND_URL}`;
          window.open(url, "_self");
        } else {
          alert("Code de vérification incorrect. Veuillez réessayer.");
        }
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
        <div className="continue-with">
          <Login42 />
          <LoginGoogle />
          {
            displayPopup &&
          <div id="popup">
              <div className="popup-modal">
                <div className="popup-content">
                  <p>Please enter the verification code sent to your email:</p>
                  <input type="text" id="verificationCode" style={{ color: "black" }} />
                  <button onClick={submitVerificationCode}> Valider</button>
                </div>
              </div>
            </div>
          }
        </div>
      </form>
    </div>
  );
};