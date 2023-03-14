export const ServerEvents = {
  LobbyState: "server.lobby.state",
  GameInit: "server.game.init",
  GameUpdate: "server.game.update",
  PlayUpdate: "server.play.update",
  PaddleUpdate: "server.paddle.update",
  ScoreUpdate: "server.score.update",
  GameEnd: "server.game.end",
} as const;

export type TServerEvents = (typeof ServerEvents)[keyof typeof ServerEvents];
