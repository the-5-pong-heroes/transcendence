export const menuItems = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Login",
    path: "/Login",
  },
  {
    label: "Game",
    path: "/Game",
    submenuItems: [
      {
        label: "Pong 2D",
        path: "/Game/Pong2D",
      },
      {
        label: "Pong 3D",
        path: "/Game/Pong3D",
      },
    ],
  },
  {
    label: "Leaderboard",
    path: "/Leaderboard",
  },
  {
    label: "Chat",
    path: "/Chat",
  },
];
