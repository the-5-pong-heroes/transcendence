import React, { useRef, useState, useEffect, Dispatch, SetStateAction } from "react";
import { Parallax } from "react-scroll-parallax";
import { useNavigate, useLocation } from "react-router-dom";

import "./Container.css";
import {
  Background,
  BackgroundLight,
  Moon,
  Light,
  Stars,
  Trash1,
  Trash2,
  Trash3,
  Cloud,
  Cloud2,
  MoonDayLight,
} from "@assets";
import type { AppContextParameters, GameState } from "@types";
import { useAppContext } from "@hooks";

interface ContainerProps {
  children: React.ReactNode;
  goTo: string;
  setGoTo: Dispatch<SetStateAction<string>>;
}

export const Container: React.FC<ContainerProps> = ({ children, goTo, setGoTo }) => {
  const { theme, isNavigatingRef, gameState }: AppContextParameters = useAppContext();
  const { isRunning, setQuitGame, newRoute }: GameState = gameState;

  const [x, setX] = useState<number>(0);
  const [sectionSize, setSectionSize] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleScroll = (event: React.UIEvent<HTMLDivElement>): void => {
    event.stopPropagation();
    setX(event.currentTarget.scrollTop);
    if (goTo === "") {
      navigateToSection();
    }
	if (goTo !== "") {
	  checkNavigation();
	}
  };

  const checkNavigation = (): void => {
	  if (sectionSize === 0) return;
	  if (x >= sectionSize * 3.5 && goTo === "/Settings") {
		  setGoTo("");
	  } else if (x >= sectionSize * 3.5 && goTo.substring(0, 8) === "/Profile") {
		  setGoTo("");
	  } else if (x >= sectionSize * 2.5 && x < sectionSize * 3.5 && goTo === "/Chat") {
		  setGoTo("");
	  } else if (x >= sectionSize * 1.5 && x < sectionSize * 2.5 && goTo === "/Leaderboard") {
		  setGoTo("");
	  } else if (x >= sectionSize * .5 && x < sectionSize * 1.5 && goTo === "/Game") {
		  setGoTo("");
	  } else if (x < sectionSize * .5 && goTo === "/") {
		  setGoTo("");
	  }
  }

  const navigateToSection = (): void => {
	  if (sectionSize === 0) return;
	  if (x >= sectionSize * 3.5 && location.pathname.substring(0, 8) !== "/Profile") {
		  navigate("/Profile");
	  } else if (x >= sectionSize * 2.5 && x < sectionSize * 3.5 && location.pathname !== "/Chat") {
		  navigate("/Chat");
	  } else if (x >= sectionSize * 1.5 && x < sectionSize * 2.5 && location.pathname !== "/Leaderboard") {
		  navigate("/Leaderboard");
	  } else if (x >= sectionSize * .5 && x < sectionSize * 1.5 && location.pathname !== "/Game") {
		  navigate("/Game");
	  } else if (x < sectionSize * .5 && location.pathname !== "/") {
		  navigate("/");
	  }
  };

  useEffect(() => {
    if (containerRef.current) {
		if (containerRef.current.scrollWidth < containerRef.current.scrollHeight) {
			setSectionSize((containerRef.current.scrollHeight - document.documentElement.scrollWidth) / 4);
		} else {
			setSectionSize((containerRef.current.scrollWidth - document.documentElement.scrollWidth) / 4);
		}
    }
  }, []);

  return (
    <div onScroll={handleScroll} ref={containerRef} className="container">
      <div className="wrap">
        <div className="background">
          <img src={theme === "light" ? BackgroundLight : Background} />
        </div>
        <Parallax className="layer stars" translateX={["-200px", "10px"]}>
          <img src={Stars} />
        </Parallax>
        <Parallax className="layer light" speed={120}>
          <img src={Light} />
        </Parallax>
        <Parallax className="layer moon" speed={10}>
          <img src={Moon} />
        </Parallax>
        <Parallax className="layer moonDayLight" speed={10}>
          <img src={MoonDayLight} />
        </Parallax>
        <Parallax className="layer cloud" speed={55}>
          <img src={Cloud} />
        </Parallax>
        <Parallax className="layer cloud" speed={70}>
          <img src={Cloud2} />
        </Parallax>
        <Parallax className="layer trash" speed={30}>
          <img src={Trash1} />
        </Parallax>
        <Parallax className="layer trash" speed={60}>
          <img src={Trash2} />
        </Parallax>
        <Parallax className="layer trash" speed={60}>
          <img src={Trash3} className="parallax-img" />
        </Parallax>
        <div className="container-section">{children}</div>
      </div>
    </div>
  );
};
