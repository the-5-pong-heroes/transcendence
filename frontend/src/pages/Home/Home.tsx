import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

interface HomeProps {
  homeRef: React.RefObject<HTMLDivElement>;
}

export const Home: React.FC<HomeProps> = ({ homeRef }) => {
  const navigate = useNavigate();
 
  return (
    <div ref={homeRef} id="Home" className="home">
      <h1>HOME</h1>
    </div>
  );
}
