import { Injectable, ValidationPipe, ValidationError } from "@nestjs/common";
import { ServerException } from "./server.exception";
import { SocketExceptions } from "./@types";

@Injectable()
export class WsValidationPipe extends ValidationPipe {
  createExceptionFactory() {
    return (validationErrors: ValidationError[] = []) => {
      if (this.isDetailedOutputDisabled) {
        return new ServerException(SocketExceptions.UnexpectedError, "Bad request");
      }

      const errors = this.flattenValidationErrors(validationErrors);

      return new ServerException(SocketExceptions.UnexpectedPayload, errors);
    };
  }
}
