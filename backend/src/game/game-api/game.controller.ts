import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { GameService } from "./game.service";
import { Game } from "@prisma/client";
import { CreateGameDto, UpdateGameDto } from "./dto";

@Controller("Game")
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  async create(@Body() createGameDto: CreateGameDto): Promise<Game> {
    return this.gameService.create(createGameDto);
  }

  @Get()
  async findAll(): Promise<Game[]> {
    return this.gameService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<Game | null> {
    return this.gameService.findOne(id);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateGameDto: UpdateGameDto): Promise<Game | null> {
    return this.gameService.update(id, updateGameDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<Game | null> {
    return this.gameService.remove(id);
  }
}
