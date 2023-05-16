import React from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

interface LoginProps {
  loginRef: React.RefObject<HTMLDivElement>;
}

export const Login: React.FC<LoginProps> = ({ loginRef }) => {
  const navigate = useNavigate();

  const handleAuth42 = () => {
    let url = "localhost:3333/auth/Oauth42/callback";
    window.open(url, "_self");
  };

  const handleAuthGoogle = () => {
    navigate("/auth/google");
  };

  return (
    <div ref={loginRef} id="Login" className="login">
    <h1>Login</h1>
    <div className="button-group">
        <button className="button" onClick={handleAuth42}>Connect with 42</button>
        <button className="button google-button" onClick={handleAuthGoogle}>Connect with Google</button>
      </div>
  </div>
  );
};
