import React from "react";
import { Link } from "react-router-dom";

import { handleOnClickButton } from "@/helpers";
import { useAppContext } from "@hooks";
import type { AppContextParameters } from "@types";

import "./Home.css";

interface HomeProps {
  homeRef: React.RefObject<HTMLDivElement>;
}

export const Home: React.FC<HomeProps> = ({ homeRef }) => {
  const { gameState, isNavigatingRef }: AppContextParameters = useAppContext();

  const onClick = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    handleOnClickButton({ event, path: "/", menuRef: homeRef, gameState, isNavigatingRef });
  };

  return (
    <div ref={homeRef} id="Home" className="home">
      <h1>Welcome !</h1>
      <div className="home-play-button">
        <Link to={"/Game"} className="game-link" onClick={onClick}>
          <span>Ready to play ?</span>
          <svg width="13px" height="10px" viewBox="0 0 13 10">
            <path d="M1,5 L11,5"></path>
            <polyline points="8 1 12 5 8 9"></polyline>
          </svg>
        </Link>
      </div>
    </div>
  );
}
