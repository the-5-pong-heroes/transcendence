import React, { useContext } from "react";

import { AppContext } from "../../contexts";
import "./ThemeButton.css";
import { LightTheme, DarkTheme } from "../../assets";

export const ThemeButton: React.FC = () => {
  const appContext = useContext(AppContext);
  if (appContext === undefined) {
    throw new Error("Undefined AppContext");
  }
  const { toggleTheme, theme } = appContext;

  return (
    <div className="theme-container" onClick={toggleTheme}>
      <img src={theme === "light" ? LightTheme : DarkTheme} className="theme-icon" />
    </div>
  );
};
