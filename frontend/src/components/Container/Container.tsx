import React, { useState, useRef } from "react";
import { useParallax } from "react-scroll-parallax";

import "./Container.css";
import { Background, Moon, Light, Stars, Trash1, Trash2, Trash3 } from "../../assets";

interface ContainerProps {
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ children }) => {
  const [x, setX] = useState<number>(0);
  const target = useRef<HTMLElement | undefined>(undefined);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>): void => {
    event.stopPropagation();
    setX(event.currentTarget.scrollTop);
  };

  const startAndEnd = {
    startScroll: 0,
    endScroll: window.innerWidth,
  };

  const backgroundRef = useParallax<HTMLDivElement>({
    ...startAndEnd,
    scale: [1, 1, "easeInQuad"],
  });

  const starsRef = useParallax<HTMLDivElement>({
    speed: 100,
    targetElement: target.current,
  });

  const lightRef = useParallax<HTMLDivElement>({
    speed: -10,
    translateY: [-100, 100],
    targetElement: target.current,
  });

  const moonRef = useParallax<HTMLDivElement>({
    ...startAndEnd,
    scale: [1, 1, "easeInQuad"],
    translateX: [0, 100],
  });

  const trashRef = useParallax<HTMLDivElement>({
    ...startAndEnd,
    scale: [1, 1, "easeInQuad"],
    translateX: [0, 100],
  });

  return (
    <div onScroll={handleScroll} className="container">
      <div className="wrap">
        <div className="layer background" ref={backgroundRef.ref}>
          <img src={Background} />
        </div>
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
        <div className="layer trash" ref={trashRef.ref}>
          <img src={Trash2} />
        </div>
        <div className="layer trash" ref={trashRef.ref}>
          <img src={Trash3} />
        </div>
        {children}
      </div>
    </div>
  );
};
