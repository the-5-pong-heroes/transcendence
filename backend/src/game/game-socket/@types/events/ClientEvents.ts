export const ClientEvents = {
  LobbyJoin: "client.lobby.join",
  UserMove: "client.user.move",
  GameUpdate: "client.game.update",
  GamePause: "client.game.pause",
  LobbyLeave: "client.lobby.leave",
  GameView: "client.game.view",
} as const;

export type TClientEvents = typeof ClientEvents[keyof typeof ClientEvents];
