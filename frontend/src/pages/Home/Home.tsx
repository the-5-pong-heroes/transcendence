import React from "react";

import "./Home.css";

interface HomeProps {
  homeRef: React.RefObject<HTMLDivElement>;
}

export const Home: React.FC<HomeProps> = ({ homeRef }) => {
  return (
    <div ref={homeRef} id="Home" className="home">
      <h1>Home</h1>
    </div>
  );
};
