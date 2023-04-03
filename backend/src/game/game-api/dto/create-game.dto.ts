import { IsNumber, IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateGameDto {
    @IsNotEmpty()
    @IsNumber()
    readonly socketId: string;

    @IsBoolean()
    finished: boolean = false;

    @IsNotEmpty()
    @IsString()
    readonly playerOneId?: string;

    @IsString()
    readonly playerTwoId?: string;
  
    @IsNumber()
    playerOneScore: number = 0;
  
    @IsNumber()
    playerTwoScore: number = 0;

    constructor(socketId: string) {
      this.socketId = socketId;
    }
}
