import React from "react";

import { useAppContext } from "@hooks";
import type { AppContextParameters } from "@types";
import { LightTheme, DarkTheme } from "@assets";
import "./ThemeButton.css";

export const ThemeButton: React.FC = () => {
  const { toggleTheme, theme }: AppContextParameters = useAppContext();

  return (
    <div className="theme-container" onClick={toggleTheme}>
      <img src={theme === "light" ? DarkTheme : LightTheme} className="theme-icon" />
    </div>
  );
};
