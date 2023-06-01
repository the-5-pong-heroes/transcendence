import React from "react";

import { Plant, Walle, Eve, Energy } from "../../assets";

export const UserLevel = ({ myClassName, level}: {myClassName: string; level: string}) => {

  const LEVELS: string[] = ["plant", "walle", "eve", "energy"];
  // const levelPicture = [Plant, Walle, Eve, Energy][LEVELS.indexOf(level)];
  const levelIndex = LEVELS.indexOf(level);
  const levelPicture = levelIndex !== -1 ? [Plant, Walle, Eve, Energy][levelIndex] : null;
  console.log("levelPicture:", levelPicture, level, LEVELS.indexOf(level));
  console.log("level:", level, LEVELS.indexOf("plant"));

  return (
    <div className={myClassName}>
      {/* <img src={Plant} alt="levelPicture" /> */}
      <img src={levelPicture} alt="levelPicture" />
      <span>{level}</span>
    </div>
    );
};
