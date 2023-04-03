import React, { useContext } from "react";

import { ThemeContext } from "../../contexts";
import "./ThemeButton.css";
import SunIcon from "../../assets/theme/sun.svg";
import MoonIcon from "../../assets/theme/moon.svg";

export const ThemeButton: React.FC = () => {
  const themeContext = useContext(ThemeContext);
  if (themeContext === undefined) {
    throw new Error("Undefined ThemeContext");
  }
  const { toggleTheme, theme } = themeContext;

  return (
    <div className="theme-container">
      <img src={theme === "light" ? SunIcon : MoonIcon} className="theme-icon" onClick={toggleTheme} />
    </div>
  );
};
