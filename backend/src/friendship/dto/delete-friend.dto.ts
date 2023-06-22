import { IsString, IsNotEmpty } from "class-validator";

export class DeleteFriendDto {
  @IsString()
  @IsNotEmpty()
  friendId: string;
}
