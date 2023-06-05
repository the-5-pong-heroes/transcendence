export const ClientEvents = {
  GameConnect: "client.game.connect",
  GameDisconnect: "client.game.disconnect",
  LobbyJoin: "client.lobby.join",
  UserMove: "client.user.move",
  GameUpdate: "client.game.update",
  GamePause: "client.game.pause",
  LobbyLeave: "client.lobby.leave",
  GameView: "client.game.view",
<<<<<<< HEAD
  GameJoin: "client.game.join",
  GameInvite: "client.game.invite",
  GameInviteResponse: "client.game.invite.response",
=======
>>>>>>> master
} as const;

export type TClientEvents = (typeof ClientEvents)[keyof typeof ClientEvents];
