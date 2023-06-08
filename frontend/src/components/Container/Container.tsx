import React, { useRef, useState, useEffect } from "react";
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
import type { AppContextParameters } from "@types";
import { useAppContext } from "@hooks";

interface ContainerProps {
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ children }) => {
  const { theme, isNavigatingRef }: AppContextParameters = useAppContext();

  const [x, setX] = useState<number>(0);
  const [sectionSize, setSectionSize] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleScroll = (event: React.UIEvent<HTMLDivElement>): void => {
    event.stopPropagation();
    setX(event.currentTarget.scrollTop);
    const ratio = window.innerWidth / window.innerHeight;
    if (!isNavigatingRef.current && ratio < 2.0) {
      navigateToSection();
    }
  };
  const navigateToSection = (): void => {
    if (x >= sectionSize * 4 && location.pathname !== "/Profile") {
      navigate("/Profile");
    } else if (x >= sectionSize * 3 && x < sectionSize * 4 && location.pathname !== "/Chat") {
      navigate("/Chat");
    } else if (x >= sectionSize * 2 && x < sectionSize * 3 && location.pathname !== "/Leaderboard") {
      navigate("/Leaderboard");
    } else if (x >= sectionSize && x < sectionSize * 2 && location.pathname !== "/Game") {
      navigate("/Game");
    } else if (x < sectionSize && location.pathname !== "/") {
      navigate("/");
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      setSectionSize((containerRef.current.scrollWidth - document.documentElement.scrollWidth) / 5);
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
          <div className="parallax-wrapper">
            <img src={Trash3} className="parallax-img" />
          </div>
        </Parallax>
        <div className="container-section">{children}</div>
      </div>
    </div>
  );
};
