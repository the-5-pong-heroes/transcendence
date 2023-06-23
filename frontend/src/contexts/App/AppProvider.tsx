import React, { useMemo, useState, useRef } from "react";

import { AppContext } from "./AppContext";

import type { AppContextParameters, ThemeMode, PageRefs, GameState, InvitationState } from "@types";

interface ProviderParameters {
  children: React.ReactNode;
}

const useInitRefs = (): PageRefs => {
  return {
    homeRef: useRef<HTMLDivElement>(null),
    gameRef: useRef<HTMLDivElement>(null),
    boardRef: useRef<HTMLDivElement>(null),
    chatRef: useRef<HTMLDivElement>(null),
    profileRef: useRef<HTMLDivElement>(null),
    notFoundRef: useRef<HTMLDivElement>(null),
    settingsRef: useRef<HTMLDivElement>(null),
    myProfileRef: useRef<HTMLDivElement>(null),
  };
};

const useInitGameState = (): GameState => {
  const isRunning = useRef<boolean>(false);
  const [quitGame, setQuitGame] = useState<boolean>(false);
  const newRoute = useRef<string>("/");

  return {
    isRunning,
    quitGame,
    setQuitGame,
    newRoute,
  };
};

const useInitInvitationState = (): InvitationState => {
  const [invitation, setInvitation] = useState<boolean>(false);

  const senderSocket = useRef<string | undefined>(undefined);
  const senderName = useRef<string | undefined>(undefined);

  return {
    invitation,
    setInvitation,
    senderSocket,
    senderName,
  };
};

export const AppProvider: React.FC<ProviderParameters> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>("dark");

  const toggleTheme = (): void => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

  const pageRefs: PageRefs = useInitRefs();
  const gameState: GameState = useInitGameState();
  const invitationState: InvitationState = useInitInvitationState();
  const isNavigatingRef = useRef<boolean>(false);

  const appContext = useMemo((): AppContextParameters => {
    return {
      theme,
      toggleTheme,
      pageRefs,
      gameState,
      invitationState,
      isNavigatingRef,
    };
  }, [theme, pageRefs, gameState, invitationState, isNavigatingRef]);

  return <AppContext.Provider value={appContext}>{children}</AppContext.Provider>;
};
