import { v4 as uuid4 } from "uuid";
import { Socket, Server } from "socket.io";
import { LobbyStatus, PaddleSide, GameMode, LobbyMode, LobbyState } from "./@types";
import { ServerEvents, ServerPayloads, TServerEvents, AuthenticatedSocket } from "./@types";
import { GameService } from "./game.service";
import { GameLoop } from "./game-logic";
import { PrismaService } from "../database/prisma.service";
import { Game, GameStatus, UserStatus } from "@prisma/client";
import { UserService } from "src/user/user.service";
import { EventEmitter } from "events";

/*  playerRight = player2 --> is by default the first user to connect  */
/*  playerLeft = player1 --> is by default a bot if no other player joins the game  */

interface Player {
  name: string;
  id: string;
  socketId: string;
}

export class GameLobby extends EventEmitter {
  public readonly id: string = uuid4();

  public readonly createdAt: Date = new Date();

  /*  clients: Map <socketId, socket> --> contains Players && Viewers */
  public readonly clients: Map<AuthenticatedSocket["id"], AuthenticatedSocket> = new Map<
    Socket["id"],
    AuthenticatedSocket
  >();

  /*   player: { PaddleSide: PlayerInfos } */
  public readonly player: { [key in PaddleSide]: Player | undefined } = {
    left: undefined,
    right: undefined,
  };

  public readonly gameLoop: GameLoop;
  public status: LobbyStatus = "waiting";

  constructor(
    private readonly server: Server,
    public readonly gameMode: GameMode,
    public readonly lobbyMode: LobbyMode,
    private readonly gameService: GameService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {
    super();
    this.gameLoop = new GameLoop(this, this.server);
  }

  /***************     SETUP    ***************/

  public addViewer(client: AuthenticatedSocket): void {
    this.addClient(client);
    client.emit(ServerEvents.ScoreUpdate, {
      score: this.gameLoop.score.getState(),
      play: this.gameLoop.play.getState(),
    });
    client.emit(ServerEvents.LobbyState, this.getState());
  }

  public addClient(client: AuthenticatedSocket): void {
    this.clients.set(client.id, client);
    client.join(this.id);
    client.data.lobby = this;
  }

  public checkOpponentId(client: AuthenticatedSocket): boolean {
    return client.data.userId !== this.player["right"]?.id;
  }

  public addPlayer(client: AuthenticatedSocket, paddleSide: PaddleSide): void {
    this.addClient(client);
    this.player[paddleSide] = { name: client.data.userName, id: client.data.userId, socketId: client.id };
    this.gameLoop.setPlayer(client, paddleSide);
  }

  /**************   START GAME   **************/

  public startGame(): void {
    // Wait for the players to be connected
    this.status = "running";
    this.updatePlayersStatus("IN_GAME");
    this.prismaCreateGame();
    this.gameLoop.initScore();
    for (const [clientId, client] of this.clients) {
      this.server.to(clientId).emit(ServerEvents.GameInit, {
        side: client.data.paddle?.side,
        lobbyMode: this.lobbyMode,
        gameMode: this.gameMode,
      });
    }
    this.dispatchToLobby(ServerEvents.ScoreUpdate, {
      score: this.gameLoop.score.getState(),
      play: this.gameLoop.play.getState(),
    });
    this.dispatchToLobby(ServerEvents.LobbyMessage, "Game is starting!");
    this.gameLoop.start();
  }

  /**************   END GAME   **************/

  public endGame(winner: PaddleSide, loser: PaddleSide): void {
    const winnerName = this.player[winner] ? this.player[winner]?.name : "The bot";
    this.status = "waiting";
    this.prismaUpdateEndGame();
    for (const [clientId, client] of this.clients) {
      let result = "None";
      if (client.data.paddle !== undefined && client.data.paddle.side === winner) {
        result = "Winner";
      } else if (client.data.paddle !== undefined && client.data.paddle.side === loser) {
        result = "Loser";
      }
      this.server.to(clientId).emit(ServerEvents.GameEnd, { result: result, winnerName: winnerName });
      this.removeClient(client);
    }
    this.gameService.removeLobby(this.id);
    // this.displayGames();
  }

  /***************    CLEANUP    ***************/

  public removeClient(client: AuthenticatedSocket): void {
    this.updatePlayerStatus(client.data.paddle?.side, "ONLINE");
    this.clients.delete(client.id);
    client.leave(this.id);
    if (this.status === "running" && client.data.paddle !== undefined) {
      this.displayMessage(client, `${client.data.userName} left the game`);
      /* If game is in pause, resume game for other clients */
      if (this.gameLoop.isInPause()) {
        this.gameLoop.pause();
      }
    }
    client.data.lobby = undefined;
    client.data.paddle = undefined;
    if (this.status === "waiting") {
      this.gameService.removeLobby(this.id);
    }
  }

  /************   PRISMA OPERATIONS   ************/

  async prismaCreateGame(): Promise<Game | null> {
    if (!this.player["right"]) {
      return null;
    }
    const userRight = this.player["right"].id;
    const userLeft = this.player["left"]?.id;

    const newGame = await this.prisma.game.create({
      data: {
        id: this.id,
        status: GameStatus.RUNNING,
        playerOneId: userRight,
        playerTwoId: userLeft,
        playerOneScore: 0,
        playerTwoScore: 0,
      },
    });
    return newGame;
  }

  async prismaUpdateGameStatus(status: GameStatus): Promise<void> {
    await this.prisma.game.update({
      where: { id: this.id },
      data: {
        status: status,
      },
    });
  }

  async prismaUpdateEndGame(): Promise<Game | null> {
    return await this.prisma.game.update({
      where: { id: this.id },
      data: {
        status: GameStatus.FINISHED,
        playerOneScore: this.gameLoop.score.player2,
        playerTwoScore: this.gameLoop.score.player1,
        endedAt: new Date(),
      },
    });
  }

  async prismaDeleteGame(): Promise<void> {
    await this.prisma.game.delete({
      where: { id: this.id },
    });
  }

  async prismaGetGames(): Promise<Game[] | null> {
    return await this.prisma.game.findMany();
  }

  /***************     UTILS    ***************/

  /* Display message to every clients except one */
  public displayMessage(client: AuthenticatedSocket, message: string): void {
    for (const [clientId] of this.clients) {
      if (clientId !== client.id) {
        this.server.to(clientId).emit(ServerEvents.LobbyMessage, message);
      }
    }
  }

  private async updatePlayersStatus(status: UserStatus): Promise<void> {
    if (this.player["right"]) {
      await this.userService.updateStatus(this.player["right"].id, status);
    }
    if (this.player["left"]) {
      await this.userService.updateStatus(this.player["left"].id, status);
    }
  }

  private async updatePlayerStatus(paddleSide: PaddleSide | undefined, status: UserStatus): Promise<void> {
    if (paddleSide === undefined || this.player[paddleSide] === undefined) {
      return;
    }
    const id = this.player[paddleSide]?.id;
    if (id !== undefined) {
      await this.userService.updateStatus(id, status);
    }
  }

  public dispatchLobbyState(): void {
    const payload: ServerPayloads[typeof ServerEvents.LobbyState] = this.getState();
    this.dispatchToLobby(ServerEvents.LobbyState, payload);
  }

  public dispatchToLobby<T>(event: TServerEvents, payload: T): void {
    this.server.to(this.id).emit(event, payload);
  }

  public getState(): LobbyState {
    return {
      id: this.id,
      userLeft: this.getLeftPlayerName(),
      userRight: this.getRightPlayerName(),
      status: this.status,
      mode: this.lobbyMode,
      gameMode: this.gameMode,
    };
  }

  public getRightPlayerName(): string {
    const name = this.player["right"]?.name;
    return name ? name : "...";
  }

  public getLeftPlayerName(): string {
    const name = this.player["left"]?.name;
    return name ? name : this.lobbyMode === "solo" ? "Bot" : "...";
  }

  async displayGames(): Promise<void> {
    const games = await this.prismaGetGames();
    console.log("=============================");
    if (games) {
      games.forEach((game) => {
        console.log(`Player 1: ${game.playerOneId}, Score: ${game.playerOneScore}`);
        console.log(`Player 2: ${game.playerTwoId}, Score: ${game.playerTwoScore}`);
        console.log(`Created at: ${game.startedAt}`);
        console.log(`Ended at: ${game.endedAt}`);
        console.log(`Status: ${game.status}`);
        console.log("=============================");
      });
    }
  }
}
