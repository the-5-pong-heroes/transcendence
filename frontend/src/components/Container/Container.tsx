import React, { useContext, useState, useRef } from "react";
import { useParallax } from "react-scroll-parallax";

import { ThemeContext } from "../../contexts";

import "./Container.css";
import { Background, BackgroundLight, Moon, Light, Stars, Trash1, Trash2, Trash3 } from "../../assets";

interface ContainerProps {
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ children }) => {
  const themeContext = useContext(ThemeContext);
  if (themeContext === undefined) {
    throw new Error("Undefined ThemeContext");
  }
  const { theme } = themeContext;

  const [x, setX] = useState<number>(0);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>): void => {
    event.stopPropagation();
    setX(event.currentTarget.scrollTop);
  };

  const target = useRef<HTMLElement>();

  const backgroundRef = useParallax<HTMLDivElement>({
    scale: [1, 1, "easeInQuad"],
  });

  const starsRef = useParallax<HTMLDivElement>({
    speed: 40
  });

  const moonRef = useParallax<HTMLDivElement>({
    speed: 50,
    targetElement: target.current,
  });

  const lightRef = useParallax<HTMLDivElement>({
    speed: 80,
    targetElement: target.current,
  });

  const trashRef = useParallax<HTMLDivElement>({
    speed: 80
  });

  const trash2Ref = useParallax<HTMLDivElement>({
    speed: 100
  });

  const trash3Ref = useParallax<HTMLDivElement>({
    speed: 70
  });

  return (
    <div onScroll={handleScroll} className="container">
      <div className="wrap">
        <div className="background" ref={backgroundRef.ref}>
          <img src={theme === "light" ? BackgroundLight : Background} />
        <div className="layer stars" ref={starsRef.ref}>
          <img src={Stars} />
        </div>
        <div className="layer light" ref={lightRef.ref}>
          <img src={Light} />
        </div>
        <div className="layer moon" ref={moonRef.ref}>
          <img src={Moon} />
        </div>
        <div className="layer trash" ref={trashRef.ref}>
          <img src={Trash1} />
        </div>
        <div className="layer trash" ref={trash2Ref.ref}>
          <img src={Trash2} />
        </div>
        <div className="layer trash" ref={trash3Ref.ref} >
          <img src={Trash3} style={{ left: -100 }} />
        </div>
        </div>
        {children}
      </div>
    </div>
  );
};
