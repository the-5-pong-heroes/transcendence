export const SocketExceptions = {
  UnexpectedError: "exception.unexpected_error",
  UnexpectedPayload: "exception.unexpected_payload",
  LobbyError: "exception.lobby_error",
  GameError: "exception.game_error",
} as const;

export type TSocketExceptions = (typeof SocketExceptions)[keyof typeof SocketExceptions];
