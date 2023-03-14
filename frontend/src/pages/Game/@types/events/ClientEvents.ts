export const ClientEvents = {
  LobbyJoin: "client.lobby.join",
  UserMove: "client.user.move",
  GameUpdate: "client.game.update",
  GamePause: "client.game.pause",
  LobbyLeave: "client.lobby.leave",
} as const;

export type TClientEvents = (typeof ClientEvents)[keyof typeof ClientEvents];
