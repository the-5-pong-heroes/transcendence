import React from "react";
import { Link } from "react-router-dom";

import "./Home.css";

interface HomeProps {
  homeRef: React.RefObject<HTMLDivElement>;
}

export const Home: React.FC<HomeProps> = ({ homeRef }) => {
  return (
    <div ref={homeRef} id="Home" className="home">
      <h1>Welcome !</h1>
      <div className="home-play-button">
        <Link to={"/Game"} className="game-link">
          Ready to play ?
        </Link>
      </div>
    </div>
  );
};
