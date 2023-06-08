import {
  RobotLight,
  RobotDark,
  ChatLight,
  ChatDark,
  GameLight,
  GameDark,
  LeaderboardLight,
  LeaderboardDark,
} from "@assets";

export interface MenuRefs {
  gameRef: React.RefObject<HTMLDivElement>;
  boardRef: React.RefObject<HTMLDivElement>;
  chatRef: React.RefObject<HTMLDivElement>;
  myProfileRef: React.RefObject<HTMLDivElement>;
}

export type MenuRefName = keyof MenuRefs;

export type MenuItem<RefName extends MenuRefName = MenuRefName> = {
  label: string;
  path: string;
  iconLight: string;
  iconDark: string;
  refName: RefName;
};

export const menuItems: MenuItem[] = [
  {
    label: "Game",
    path: "/Game",
    iconLight: GameLight,
    iconDark: GameDark,
    refName: "gameRef",
  },
  {
    label: "Leaderboard",
    path: "/Leaderboard",
    iconLight: LeaderboardLight,
    iconDark: LeaderboardDark,
    refName: "boardRef",
  },
  {
    label: "Chat",
    path: "/Chat",
    iconLight: ChatLight,
    iconDark: ChatDark,
    refName: "chatRef",
  },
  {
    label: "Profile",
    path: "/Profile",
    iconLight: RobotLight,
    iconDark: RobotDark,
    refName: "myProfileRef",
  },
];
