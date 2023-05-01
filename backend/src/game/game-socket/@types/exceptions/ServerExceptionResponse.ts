import { TSocketExceptions } from "./SocketExceptions";

export type ServerExceptionResponse = {
  exception: TSocketExceptions;
  message?: string | object;
};
