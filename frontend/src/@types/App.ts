export type ThemeMode = "light" | "dark";

export interface PageRefs {
  homeRef: React.RefObject<HTMLDivElement>;
  gameRef: React.RefObject<HTMLDivElement>;
  boardRef: React.RefObject<HTMLDivElement>;
  chatRef: React.RefObject<HTMLDivElement>;
  profileRef: React.RefObject<HTMLDivElement>;
  notFoundRef: React.RefObject<HTMLDivElement>;
  settingsRef: React.RefObject<HTMLDivElement>;
  myProfileRef: React.RefObject<HTMLDivElement>;
}

export interface GameState {
  isRunning: React.MutableRefObject<boolean>;
  quitGame: boolean;
  setQuitGame: (quitGame: boolean) => void;
  newRoute: React.MutableRefObject<string>;
}

export interface InvitationState {
  invitation: boolean;
  setInvitation: (value: boolean) => void;
  senderSocket: React.MutableRefObject<string | undefined>;
  senderName: React.MutableRefObject<string | undefined>;
}

export interface AppContextParameters {
  theme: ThemeMode;
  toggleTheme: () => void;
  pageRefs: PageRefs;
  gameState: GameState;
  invitationState: InvitationState;
  isNavigatingRef: React.MutableRefObject<boolean>;
  // twoFA: boolean;
  // toggleTwoFA: () => void;
}
