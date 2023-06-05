<<<<<<< HEAD
import React, { useState } from "react";
import { Parallax } from "react-scroll-parallax";

import { useAppContext } from "@hooks";
import type { AppContextParameters } from "@types";
=======
import React, { useContext, useState } from "react";
import { Parallax } from "react-scroll-parallax";

import { AppContext } from "../../contexts";
>>>>>>> master
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
<<<<<<< HEAD
} from "@assets";
=======
} from "../../assets";
>>>>>>> master

interface ContainerProps {
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ children }) => {
<<<<<<< HEAD
  const { theme }: AppContextParameters = useAppContext();
=======
  const appContext = useContext(AppContext);
  if (appContext === undefined) {
    throw new Error("Undefined AppContext");
  }
  const { theme } = appContext;
>>>>>>> master

  const [x, setX] = useState<number>(0);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>): void => {
    event.stopPropagation();
    setX(event.currentTarget.scrollTop);
  };

  return (
    <div onScroll={handleScroll} className="container">
      <div className="wrap">
        <div className="background">
<<<<<<< HEAD
          <img src={theme === "light" ? BackgroundLight : Background} />
        </div>
        <Parallax className="layer stars" translateX={["-200px", "10px"]}>
          <img src={Stars} />
        </Parallax>
        <Parallax className="layer light" speed={120}>
          <img src={Light} />
        </Parallax>
        <Parallax className="layer moon" speed={10}>
=======
          <img src={theme === "light" ? BackgroundLight : Background} className="background-img" />
        </div>
        <Parallax className="layer stars" translateX={["-300px", "0px"]}>
          <img src={Stars} />
        </Parallax>
        <Parallax className="layer light" speed={120} translateX={["-400px", "100px"]}>
          <img src={Light} />
        </Parallax>
        <Parallax className="layer moon" speed={20}>
>>>>>>> master
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
<<<<<<< HEAD
        <Parallax className="layer trash" speed={30}>
          <img src={Trash1} />
        </Parallax>
        <Parallax className="layer trash" speed={60}>
          <img src={Trash2} />
        </Parallax>
        <Parallax className="layer trash"  speed={60}>
=======
        <Parallax className="layer trash" translateX={["40%", "-20%"]}>
          <img src={Trash1} />
        </Parallax>
        <Parallax className="layer trash" speed={30}>
          <img src={Trash2} />
        </Parallax>
        <Parallax className="layer trash" translateX={["50%", "-20%"]}>
>>>>>>> master
          <div className="parallax-wrapper">
            <img src={Trash3} className="parallax-img" />
          </div>
        </Parallax>
        {children}
      </div>
    </div>
  );
};
