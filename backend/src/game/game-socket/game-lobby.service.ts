import { Injectable, Inject } from "@nestjs/common";
import { Server } from "socket.io";
import { LobbyMode, PaddleSide, GameMode, AuthenticatedSocket } from "./@types";
import { Lobby } from "./lobby";
import { GameService } from "../game-api/game.service";

@Injectable()
export class GameLobbyService {
  public server!: Server;

  constructor(@Inject(GameService) private readonly gameApiService: GameService) {}

  private readonly lobbies: Map<Lobby["id"], Lobby> = new Map<
    Lobby["id"],
    Lobby
  >();

  public setupSocket(client: AuthenticatedSocket): void {
    client.data.lobby = null;
  }

  public terminateSocket(client: AuthenticatedSocket): void {
    client.data.lobby?.removeClient(client);
  }

  private createLobby(lobbyMode: LobbyMode, gameMode: GameMode): Lobby {
    let maxClients = 1;

    if (lobbyMode === "duo") {
      maxClients = 2;
    }

    const lobby = new Lobby(this.server, maxClients, gameMode, lobbyMode, this.gameApiService);
    this.lobbies.set(lobby.id, lobby);
    return lobby;
  }

  public joinLobby(
    lobbyMode: LobbyMode,
    gameMode: GameMode,
    client: AuthenticatedSocket
  ): void {
    let lobbyToJoin = null;
    let paddleSide: PaddleSide = "right";

    if (lobbyMode === "duo") {
      for (const [lobbyId, lobby] of this.lobbies) {
        if (
          lobby.status === "waiting" &&
          lobby.gameMode === gameMode &&
          lobby.clients.size < lobby.maxClients
        ) {
          lobbyToJoin = lobby;
          paddleSide = "left";
          break;
        }
      }
    }

    if (!lobbyToJoin) {
      lobbyToJoin = this.createLobby(lobbyMode, gameMode);
    }

    lobbyToJoin.addClient(client, paddleSide);
  }

  private cleanLobbies(): void {}
}
