import { v4 as uuid4 } from "uuid";
import { Socket, Server } from "socket.io";
import { LobbyStatus, PaddleSide, GameMode, LobbyMode } from "../@types";
import {
  ServerEvents,
  ServerPayloads,
  TServerEvents,
  AuthenticatedSocket,
} from "../@types";
import { GameLoop } from "../gamePlay";

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
      }
      this.gameLoop.initScore();
      this.gameLoop.start();
    }
    this.dispatchLobbyState();
  }

  public removeClient(client: AuthenticatedSocket): void {
    this.clients.delete(client.id);
    client.leave(this.id);
    client.data.lobby = null;
    // client.data.paddle = null;
    /* end Game */
    this.gameLoop.stop();
  }

  public endGame(winner: PaddleSide): void {
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
      lobbyId: this.id,
      mode: this.maxClients === 1 ? "solo" : "duo",
      status: this.status,
      game: this.gameLoop.getState(),
    };
    this.dispatchToLobby(ServerEvents.LobbyState, payload);
  }

  public dispatchToLobby<T>(event: TServerEvents, payload: T): void {
    this.server.to(this.id).emit(event, payload);
  }
}
