import React from "react";
import { useNavigate } from "react-router-dom";

import { useSignUp } from "./hooks";

export const SignUp: React.FC = () => {
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
        <h2>Sign Up</h2>
        <input className="input" type="text" name="name" placeholder="Username" required />
        <input className="input" type="text" name="email" placeholder="Email" required />
        <input className="input" type="password" name="password" placeholder="Password" required />
        <input className="submit" type="submit" value="Send" />
        <button onClick={() => navigate("/Login")}>Sign in</button>
      </form>
    </div>
  );
};
