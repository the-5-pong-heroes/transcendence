import React from "react";
import { useNavigate } from "react-router-dom";

import { useSignIn } from "./hooks";

import { BASE_URL } from "@/constants";
import { Logo_42, Logo_Google, Logo_Eve } from "@assets";
import "./Login.css";

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
  const [isActivated, setIsActivated] = React.useState(false);

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

  if (displayPopup === true) {
    handle2FAfunction();
  }

  async function handle2FAfunction(): Promise<any> {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}` + "/auth/2FA/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: twoFACode, twoFAactivated: isActivated }),
    });
    const data = await response.json();
    if (displayPopup === true) {
      openPopup(data.code);
    }
    return data;
  }

  async function openPopup(twoFACode: string) {
    const popup = document.getElementById("popup");
    if (popup) {
      popup.style.display = "block";
      popup.dataset.twoFACode = twoFACode;
    }
  }

  async function closePopup() {
    const popup = document.getElementById("popup");
    if (popup) {
      popup.style.display = "none";
      popup.removeAttribute("data-twoFACode");
    }
  }

  async function updateVerify2FA() {
    const url = `${import.meta.env.VITE_BACKEND_URL}` + "/auth/2FA/verify";
    window.open(url, "_self");
  }

  async function submitVerificationCode() {
    const verificationCodeInput = document.getElementById("verificationCode") as HTMLInputElement;
    if (verificationCodeInput) {
      const verificationCode = verificationCodeInput.value;
      const popup = document.getElementById("popup");
      if (popup) {
        const twoFACode = popup.dataset.twoFACode;
        console.log("twoFA = ", twoFACode);
        console.log("verif = ", verificationCode);
        if (verificationCode === twoFACode) {
          alert("Code de vérification correct !");
          closePopup();
          await updateVerify2FA();
          navigate("/");
        } else {
          alert("Code de vérification incorrect. Veuillez réessayer.");
        }
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
          <div id="popup" style={{ display: "none" }}>
            <div className="popup-modal">
              <div className="popup-content">
                <p>Please enter the verification code sent to your email:</p>
                <input type="text" id="verificationCode" style={{ color: "black" }} />
                <button onClick={submitVerificationCode}> Valider</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
