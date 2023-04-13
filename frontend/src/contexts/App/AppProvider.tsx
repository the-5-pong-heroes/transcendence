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
  profileRef: React.RefObject<HTMLDivElement>;
}

interface ProviderParameters {
  children: React.ReactNode;
}

export const AppProvider: React.FC<ProviderParameters> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>("light");

  const toggleTheme = (): void => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

  const homeRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const appContext = useMemo(
    (): ContextParameters => ({ theme, toggleTheme, homeRef, gameRef, boardRef, chatRef, profileRef }),
    [theme]
  );

  return <AppContext.Provider value={appContext}>{children}</AppContext.Provider>;
};
