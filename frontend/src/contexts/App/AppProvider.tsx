import React, { useMemo, useState, useRef } from "react";

import { AppContext } from "./AppContext";

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
  profileRef: React.RefObject<HTMLDivElement>;
  gameIsRunning: React.RefObject<boolean>;
}

interface ProviderParameters {
  children: React.ReactNode;
}

export const AppProvider: React.FC<ProviderParameters> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>("dark");

  const toggleTheme = (): void => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

  const homeRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const signupRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);


  const gameIsRunning = useRef<boolean>(false);

  const appContext = useMemo(
    (): ContextParameters => ({ theme, toggleTheme, homeRef, gameRef, boardRef, chatRef, logRef, signupRef, profileRef, gameIsRunning }),
    [theme]
  );

  return <AppContext.Provider value={appContext}>{children}</AppContext.Provider>;
};
