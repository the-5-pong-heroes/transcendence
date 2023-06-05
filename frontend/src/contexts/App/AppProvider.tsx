import React, { useMemo, useState, useRef } from "react";

import { AppContext } from "./AppContext";

<<<<<<< HEAD
import type { AppContextParameters, ThemeMode, PageRefs, GameState, InvitationState } from "@types";
=======
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
  settingsRef: React.RefObject<HTMLDivElement>;
  myProfileRef: React.RefObject<HTMLDivElement>;
  profileRef: React.RefObject<HTMLDivElement>;
  gameIsRunning: React.RefObject<boolean>;
}
>>>>>>> master

interface ProviderParameters {
  children: React.ReactNode;
}

<<<<<<< HEAD
const useInitRefs = (): PageRefs => {
  return {
    homeRef: useRef<HTMLDivElement>(null),
    gameRef: useRef<HTMLDivElement>(null),
    boardRef: useRef<HTMLDivElement>(null),
    chatRef: useRef<HTMLDivElement>(null),
    profileRef: useRef<HTMLDivElement>(null),
    notFoundRef: useRef<HTMLDivElement>(null),
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

=======
>>>>>>> master
export const AppProvider: React.FC<ProviderParameters> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>("dark");

  const toggleTheme = (): void => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

<<<<<<< HEAD
  const pageRefs: PageRefs = useInitRefs();
  const gameState: GameState = useInitGameState();
  const invitationState: InvitationState = useInitInvitationState();

  const appContext = useMemo((): AppContextParameters => {
    return {
      theme,
      toggleTheme,
      pageRefs,
      gameState,
      invitationState,
    };
  }, [theme, pageRefs, gameState, invitationState]);
=======
  const homeRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const signupRef = useRef<HTMLDivElement>(null);
  const myProfileRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  const gameIsRunning = useRef<boolean>(false);

  const appContext = useMemo(
    (): ContextParameters => ({ theme, toggleTheme, homeRef, gameRef, boardRef, chatRef, logRef, signupRef, myProfileRef, profileRef, gameIsRunning, settingsRef }),
    [theme]
  );
>>>>>>> master

  return <AppContext.Provider value={appContext}>{children}</AppContext.Provider>;
};
