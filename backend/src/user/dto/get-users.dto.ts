import { IsString, IsNotEmpty } from "class-validator";

export class GetUsersDto {
  @IsString()
  @IsNotEmpty()
  readonly blockedOf: string;
}
