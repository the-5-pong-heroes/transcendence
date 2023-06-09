import { IsString, IsNotEmpty, MaxLength } from "class-validator";
import { PaddleMove } from "../@types";

export class UserMoveDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(4)
  move: PaddleMove;

  constructor(move: PaddleMove) {
    this.move = move;
  }
}
