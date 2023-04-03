import {
  HomeLight,
  HomeLightSelected,
  HomeDark,
  HomeDarkSelected,
  ChatLight,
  ChatLightSelected,
  ChatDark,
  ChatDarkSelected,
  LoginLight,
  LoginLightSelected,
  LoginDark,
  LoginDarkSelected,
  PongLight,
  PongLightSelected,
  PongDark,
  PongDarkSelected,
  PodiumLight,
  PodiumLightSelected,
  PodiumDark,
  PodiumDarkSelected,
} from "@/assets";

export const menuItems = [
  {
    label: "Home",
    path: "/",
    iconLight: HomeLight,
    iconDark: HomeDark,
    iconLightSelected: HomeLightSelected,
    iconDarkSelected: HomeDarkSelected,
  },
  {
    label: "Game",
    path: "/Game",
    iconLight: PongLight,
    iconDark: PongDark,
    iconLightSelected: PongLightSelected,
    iconDarkSelected: PongDarkSelected,
  },
  {
    label: "Leaderboard",
    path: "/Leaderboard",
    iconLight: PodiumLight,
    iconDark: PodiumDark,
    iconLightSelected: PodiumLightSelected,
    iconDarkSelected: PodiumDarkSelected,
  },
  {
    label: "Chat",
    path: "/Chat",
    iconLight: ChatLight,
    iconDark: ChatDark,
    iconLightSelected: ChatLightSelected,
    iconDarkSelected: ChatDarkSelected,
  },
  {
    label: "Login",
    path: "/Login",
    iconLight: LoginLight,
    iconDark: LoginDark,
    iconLightSelected: LoginLightSelected,
    iconDarkSelected: LoginDarkSelected,
  },
];
