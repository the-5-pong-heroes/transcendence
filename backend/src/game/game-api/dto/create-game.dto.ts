import { IsNumber, IsString, IsNotEmpty, IsBoolean } from "class-validator";

export class CreateGameDto {
  @IsNotEmpty()
  @IsNumber()
  readonly socketId: string;

  @IsBoolean()
  finished = false;

  @IsNotEmpty()
  @IsString()
  readonly playerOneId?: string;

  @IsString()
  readonly playerTwoId?: string;

  @IsNumber()
  playerOneScore = 0;

  @IsNumber()
  playerTwoScore = 0;

  constructor(socketId: string) {
    this.socketId = socketId;
  }
}
