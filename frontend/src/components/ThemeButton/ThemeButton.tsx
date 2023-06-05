import React from "react";

<<<<<<< HEAD
import { useAppContext } from "@hooks";
import type { AppContextParameters } from "@types";
import { LightTheme, DarkTheme } from "@assets";
import "./ThemeButton.css";

export const ThemeButton: React.FC = () => {
  const { toggleTheme, theme }: AppContextParameters = useAppContext();

  return (
    <div className="theme-container" onClick={toggleTheme}>
      <img src={theme === "light" ? DarkTheme : LightTheme} className="theme-icon" />
=======
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
>>>>>>> master
    </div>
  );
};
