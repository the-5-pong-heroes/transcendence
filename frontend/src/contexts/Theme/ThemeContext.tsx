import React from "react";

export type ThemeMode = "light" | "dark";

interface ContextParameters {
  theme: ThemeMode;
  toggleTheme: () => void;
  scrollRef: React.MutableRefObject<string>;
}

export const ThemeContext = React.createContext<ContextParameters | undefined>(undefined);
