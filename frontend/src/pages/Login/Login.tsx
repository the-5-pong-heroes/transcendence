import React from "react";
import { useNavigate } from "react-router-dom";

import { useSignIn } from "./hooks";

import "./Login.css";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const signIn = useSignIn();

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

  return (
    <div className="Login">
      <form className="form" onSubmit={onSignIn}>
        <h2>Sign In</h2>
        <input className="input" type="text" name="email" placeholder="Email" required />
        <input className="input" type="password" name="password" placeholder="Password" required />
        <input className="submit" type="submit" value="Send" />
        <button onClick={() => navigate("/SignUp")}>Sign up</button>
      </form>
    </div>
  );
};
