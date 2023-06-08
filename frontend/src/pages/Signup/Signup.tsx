import React from "react";
import { useNavigate } from "react-router-dom";

import { useSignUp } from "./hooks";

import { Logo_Eve } from "@assets";

export const Signup: React.FC = () => {
  const signUp = useSignUp();
  const navigate = useNavigate();

  const onSignUp: React.FormEventHandler<HTMLFormElement> = (form) => {
    form.preventDefault();
    const formData = new FormData(form.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof name === "string" && typeof email === "string" && typeof password === "string") {
      signUp({
        name,
        email,
        password,
      });
    }
  };

  return (
    <div className="Login">
      <form className="form" onSubmit={onSignUp}>
        <img id="login-robot" src={Logo_Eve} />
        <input className="input" type="text" name="name" placeholder="Username" required />
        <input className="input" type="text" name="email" placeholder="Email" required />
        <input className="input" type="password" name="password" placeholder="Password" required />
        <div className="form-sign">
          <input className="submit" type="submit" value="Sign up" />
          <button className="login-link" onClick={() => navigate("/Login")}>
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
};
