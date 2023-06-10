import React from "react";

import "./ShootingStar.css";

export const ShootingStar: React.FC = () => {
  const getRandomValue = (min: number, max: number): string => {
    return `${Math.floor(Math.random() * (max - min + 1) + min)} px`;
  };

  const starStyle: React.CSSProperties = {
    width: "45px",
    height: "2px",
    top: "100px",
    right: "-10px",
    transform: "rotate(-50deg)",
    // top: getRandomValue(90, 120), // Random top position between 0px and 200px
    // right: getRandomValue(-20, 0), // Random right position between -50px and -10px
  };
  console.log(starStyle);

  return <div className="shooting-star" style={starStyle}></div>;
};
