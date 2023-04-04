import React, { useMemo, useState, useRef } from "react";

import { ThemeContext } from "./ThemeContext";

export type ThemeMode = "light" | "dark";

interface ContextParameters {
  theme: ThemeMode;
  toggleTheme: () => void;
  scrollRef: React.MutableRefObject<string>;
}

interface ProviderParameters {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ProviderParameters> = ({ children }) => {
  const	scrollRef = useRef<string>("Home");
  const [theme, setTheme] = useState<ThemeMode>("light");

  const toggleTheme = (): void => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };


  const themeContext = useMemo((): ContextParameters => ({ theme, toggleTheme, scrollRef }), [theme]);

  return <ThemeContext.Provider value={themeContext}>{children}</ThemeContext.Provider>;
};
