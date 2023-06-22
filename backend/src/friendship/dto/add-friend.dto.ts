import { IsString, IsNotEmpty } from "class-validator";

export class AddFriendDto {
  @IsString()
  @IsNotEmpty()
  newFriendId: string;
}
