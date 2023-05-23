import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

interface HomeProps {
  homeRef: React.RefObject<HTMLDivElement>;
}

export const Home: React.FC<HomeProps> = ({ homeRef }) => {
  const navigate = useNavigate();

  const handleAuth42 = () => {
    let url = `${import.meta.env.VITE_API42_URI}`;
    window.open(url, "_self");
    };

  const handleAuthGoogle = () => {
    navigate("/auth/google");
  };

  const handle2FA = () => {
    navigate("/2FA");
    };

  return (
    <div ref={homeRef} id="Home" className="home">
    <h1>Home</h1>
    <div className="button-group">
        <button className="button" onClick={handleAuth42}>Connect with 42</button>
        <button className="button" onClick={handle2FA}>Connect with 42</button>
      </div>
  </div>
  );
};
