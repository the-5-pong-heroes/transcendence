export const ServerEvents = {
  Disconnect: "server.user.disconnect",
  Connect: "server.user.connected",
  LobbyState: "server.lobby.state",
  GameInit: "server.game.init",
  GameStart: "server.game.start",
  GameUpdate: "server.game.update",
  PlayUpdate: "server.play.update",
  PaddleUpdate: "server.paddle.update",
  ScoreUpdate: "server.score.update",
  GameEnd: "server.game.end",
  GameList: "server.game.list",
  GameInvite: "server.game.invite",
  GameInviteStart: "server.game.invite.start",
  LobbyMessage: "server.lobby.message",
  PlayerAlreadySet: "player.already.set",
} as const;

export type TServerEvents = (typeof ServerEvents)[keyof typeof ServerEvents];
