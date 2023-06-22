import { IsString, IsNotEmpty, IsIn } from "class-validator";
import { PaddleMove } from "../@types";

const moves = ["up", "down", "stop"] as const;

export class UserMoveDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(moves)
  move: PaddleMove;
}
