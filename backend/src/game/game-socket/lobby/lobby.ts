import { v4 as uuid4 } from "uuid";
import { Socket, Server } from "socket.io";
import { LobbyStatus, PaddleSide, GameMode, LobbyMode } from "../@types";
import {
  ServerEvents,
  ServerPayloads,
  TServerEvents,
  AuthenticatedSocket,
} from "../@types";
import { GameLoop } from "../game-logic";
import { GameService } from "src/game/game-api/game.service";
import { Game } from "@prisma/client";

export class Lobby {
  public readonly id: string = uuid4();

  public readonly clients: Map<AuthenticatedSocket["id"], AuthenticatedSocket> =
    new Map<Socket["id"], AuthenticatedSocket>();

  public readonly gameLoop: GameLoop;
  public status: LobbyStatus = "waiting";

  constructor(
    private readonly server: Server,
    public readonly maxClients: number,
    public readonly gameMode: GameMode,
    public readonly lobbyMode: LobbyMode,
    public readonly gameService: GameService,
  ) {
    this.gameLoop = new GameLoop(this, this.server);
  }

  public addClient(client: AuthenticatedSocket, paddleSide: PaddleSide): void {
    this.clients.set(client.id, client);
    client.join(this.id);
    client.data.lobby = this;
    this.gameLoop.setUser(client, paddleSide);

    if (this.clients.size >= this.maxClients) {
      /* start Game */
      this.status = "in progress";
      for (const [clientId, client] of this.clients) {
        this.server.to(clientId).emit(ServerEvents.GameInit, client.data.paddle.side);
        this.server.to(clientId).emit(ServerEvents.ScoreUpdate, { score: this.gameLoop.score.getState(), play: this.gameLoop.play.getState() });
      }
      // Database Create Game
      this.initGame();
    }
    this.dispatchLobbyState();
  }

  private async initGame(): Promise<Game> {
    const newGame = await this.gameService.create({
      socketId: this.id,
      finished: false,
      playerOneId: "test",
      playerTwoId: "test2",
      playerOneScore: 0,
      playerTwoScore: 0,
    });
    this.gameLoop.initScore();
    this.gameLoop.start();
    return newGame;
  }

  public removeClient(client: AuthenticatedSocket): void {
    this.clients.delete(client.id);
    client.leave(this.id);
    client.data.lobby = null;
    /* end Game */
    this.gameLoop.stop();
  }

  private async terminateGame(): Promise<Game | null> {
    return await this.gameService.update(this.id, {
      finished: true,
      playerOneScore: this.gameLoop.score.player1,
      playerTwoScore: this.gameLoop.score.player2,
    });
  }

  public endGame(winner: PaddleSide): void {
    // Database update Game
    this.terminateGame();
    for (const [clientId, client] of this.clients) {
      if (client.data.paddle.side === winner) {
        this.server.to(clientId).emit(ServerEvents.GameEnd, "Winner");
      } else {
        this.server.to(clientId).emit(ServerEvents.GameEnd, "Loser");
      }
    }
  }

  public dispatchLobbyState(): void {
    const payload: ServerPayloads[typeof ServerEvents.LobbyState] = {
      mode: this.maxClients === 1 ? "solo" : "duo",
      status: this.status,
    };
    this.dispatchToLobby(ServerEvents.LobbyState, payload);
  }

  public dispatchToLobby<T>(event: TServerEvents, payload: T): void {
    this.server.to(this.id).emit(event, payload);
  }
}
