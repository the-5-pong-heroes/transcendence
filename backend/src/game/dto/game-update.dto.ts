import { IsString, IsNotEmpty } from "class-validator";
import { PaddleMove } from "../@types";

export class GameUpdateDto {
  @IsString()
  @IsNotEmpty()
	move: PaddleMove = "stop";
};
