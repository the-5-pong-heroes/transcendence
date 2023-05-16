import { WsException } from "@nestjs/websockets";
import { TSocketExceptions, ServerExceptionResponse } from "./@types";

export class ServerException extends WsException {
  constructor(type: TSocketExceptions, message?: string | object) {
    const serverExceptionResponse: ServerExceptionResponse = {
      exception: type,
      message: message,
    };
    super(serverExceptionResponse);
  }
}
