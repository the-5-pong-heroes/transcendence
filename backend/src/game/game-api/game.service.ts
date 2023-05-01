import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { Game, GameStatus } from "@prisma/client";
import { CreateGameDto, UpdateGameDto } from "./dto";

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  /***   CRUD operations   ***/

  /* Create new match */
  async create(): Promise<Game> {
    // createGameDto: CreateGameDto
    const game = this.prisma.game.create({
      data: {
        socketId: "test",
        playerOneId: "test",
        playerTwoId: "test",
        // socketId: createGameDto.socketId,
        // playerOneId: createGameDto.playerOneId,
        // playerTwoId: createGameDto.playerTwoId,
      },
    });
    return game;
  }

  /* Get all games */
  async findAll(): Promise<Game[]> {
    const games = await this.prisma.game.findMany({
      where: {
        status: GameStatus.FINISHED,
      },
    });
    return games;
  }

  /* Get one game */
  async findOne(id: string): Promise<Game | null> {
    const game = this.prisma.game.findUnique({
      where: { id: id },
    });
    return game;
  }

  /* Update a game */
  async update(): Promise<Game | null> {
    /* id: string, updateGameDto: UpdateGameDto */
    // const game = await this.prisma.game.update({
    //   where: { id: id },
    //   data: {
    //     ...updateGameDto,
    //   },
    //   include: {},
    // });
    return null;
  }

  /* Remove one match */
  async remove(id: string): Promise<Game | null> {
    const game = await this.prisma.game.delete({
      where: { id: id },
    });
    return game;
  }
}
