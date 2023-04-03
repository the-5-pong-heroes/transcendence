import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { Game } from "@prisma/client";
import { CreateGameDto, UpdateGameDto } from "./dto";

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  /***   CRUD operations   ***/

  /* Create new match */
  async create(createGameDto: CreateGameDto): Promise<Game> {
    const game = this.prisma.game.create({
        data: {
          socketId: createGameDto.socketId,
          playerOneId: createGameDto.playerOneId,
          playerTwoId: createGameDto.playerTwoId,
        }
    });
    return game;
  }

  /* Get all games */
  async findAll(): Promise<Game[]> {
    const games = await this.prisma.game.findMany({
      where: {
        finished: true,
      }
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
  async update(id: string, updateGameDto: UpdateGameDto): Promise<Game | null> {
    const game = await this.prisma.game.update({
      where: { id: id },
      data: {
        ...updateGameDto,
      },
      include: {

      }
    });
    return game;
  }

  /* Remove one match */
  async remove(id: string): Promise<Game | null> {
    const game = await this.prisma.game.delete({
        where: { id: id },
    });
    return game;
  }
}
