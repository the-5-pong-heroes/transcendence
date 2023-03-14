import { IsString, IsNotEmpty } from "class-validator";
import { PaddleMove } from "../@types";

export class UserMoveDto {
  @IsString()
  @IsNotEmpty()
	move: PaddleMove = "stop";
};
