<<<<<<< HEAD
import React from "react";
import { useNavigate } from "react-router-dom";

import { useSignIn } from "./hooks";

import { BASE_URL } from "@/constants";
import { Logo_42, Logo_Google, Logo_Eve } from "@assets";
import "./Login.css";

export const Login42: React.FC = () => {
  const handleOnClick = (): void => {
    const url = `${BASE_URL}/auth/auth42/callback`;
    window.open(url, "_self");
  };

  return (
    <div className="Login_with" onClick={handleOnClick}>
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
        <img id="login-robot" src={Logo_Eve} />
        <input className="input" type="text" name="email" placeholder="Email" required />
        <input className="input" type="password" name="password" placeholder="Password" required />
        <div className="form-sign">
          <input className="submit" type="submit" value="Sign in" />
          <button className="login-link" onClick={() => navigate("/SignUp")}>
            Sign up
          </button>
        </div>
        <div className="continue-with">
          <Login42 />
          <LoginGoogle />
        </div>
      </form>
    </div>
  );
};
=======
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ICreateUser } from '../../interfaces';
import './Login.css';

interface ILoginProps {
  logRef: React.RefObject<HTMLDivElement>;
}

export const Login: React.FC<ILoginProps> = ({ logRef }) => {
	const	[user, setUser] = useState<ICreateUser>({ email: '', password: '' });
	const	[errMessage, setErrMessage] = useState<string>('');
	const	navigate = useNavigate();

	const	handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const	{ name, value } = event.target;
		setUser(prev => ({ ...prev, [name]: value }));
	}
	
  const	handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrMessage("");
    const config = {
      method: "POST",
      mode: "cors" as RequestMode,
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(user)
    };
    const response = await fetch('http://localhost:3000/auth/signin', config);
    const data = await response.json();
    if (!response.ok)
    {
      console.log(response);
      console.log(data);
      setErrMessage(data.message);
      return;
    }
    localStorage.setItem('access_token', `Bearer ${data.access_token}`);
    navigate('/');
    window.location.reload();
}

	return (
		<div ref={logRef} className="Login">
			<form className="form" onSubmit={handleSubmit}>
				<h2>Sign In</h2>
				<input
					className="input"
					type="text"
					name="email"
					value={user.email}
					onChange={handleChange}
					placeholder="Email"
				/>
				<input
					className="input"
					type="password"
					name="password"
					value={user.password}
					onChange={handleChange}
					placeholder="Password"
				/>
				{
					errMessage && 
					<div className="err-message">{errMessage}</div>
				}
				<input
					className="submit"
					type="submit"
					value="Send"
				/>
			</form>
		</div>
	);
}

export default Login;
>>>>>>> master
