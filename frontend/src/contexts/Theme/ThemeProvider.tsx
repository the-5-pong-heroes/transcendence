import React, { useMemo, useState } from "react";

import { ThemeContext } from "./ThemeContext";

export type ThemeMode = "light" | "dark";

interface ContextParameters {
  theme: ThemeMode;
  toggleTheme: () => void;
}

interface ProviderParameters {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ProviderParameters> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>("light");

  const toggleTheme = (): void => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

  const themeContext = useMemo((): ContextParameters => ({ theme, toggleTheme }), [theme]);

  return <ThemeContext.Provider value={themeContext}>{children}</ThemeContext.Provider>;
};
