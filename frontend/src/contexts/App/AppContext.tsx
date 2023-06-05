import React from "react";

export type ThemeMode = "light" | "dark";

interface ContextParameters {
  theme: ThemeMode;
  toggleTheme: () => void;
  homeRef: React.RefObject<HTMLDivElement>;
  gameRef: React.RefObject<HTMLDivElement>;
  boardRef: React.RefObject<HTMLDivElement>;
  chatRef: React.RefObject<HTMLDivElement>;
  logRef: React.RefObject<HTMLDivElement>;
  signupRef: React.RefObject<HTMLDivElement>;
  myProfileRef: React.RefObject<HTMLDivElement>;
  profileRef: React.RefObject<HTMLDivElement>;
  settingsRef: React.RefObject<HTMLDivElement>;
  gameIsRunning: React.RefObject<boolean>;
}

export const AppContext = React.createContext<ContextParameters | undefined>(undefined);
