import React from "react";

export type ThemeMode = "light" | "dark";

interface ContextParameters {
  theme: ThemeMode;
  toggleTheme: () => void;
}

export const ThemeContext = React.createContext<ContextParameters | undefined>(undefined);
