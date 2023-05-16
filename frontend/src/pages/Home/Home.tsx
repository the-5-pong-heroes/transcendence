import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

interface HomeProps {
  homeRef: React.RefObject<HTMLDivElement>;
}

export const Home: React.FC<HomeProps> = ({ homeRef }) => {
  const navigate = useNavigate();

  const handleAuth42 = () => {
    let url = "localhost:3333/auth/Oauth42/callback";
    window.open(url, "_self");
    };

  const handleAuthGoogle = () => {
    navigate("/auth/google");
  };

  return (
    <div ref={homeRef} id="Home" className="home">
    <h1>Home</h1>
    <div className="button-group">
        <button className="button" onClick={handleAuth42}>Connect with 42</button>
        <button className="button google-button" onClick={handleAuthGoogle}>Connect with Google</button>
      </div>
  </div>
  );
};
