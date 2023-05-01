import { Injectable, Inject } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { Server } from "socket.io";
import { LobbyMode, PaddleSide, GameMode, AuthenticatedSocket, ServerEvents } from "./@types";
import { Lobby } from "./lobby";
import { GameService } from "../game-api/game.service";

const LOBBY_MAX_LIFETIME = 1000 * 60 * 60;

@Injectable()
export class GameLobbyService {
  public server!: Server;

  @Inject(GameService)
  private readonly gameApiService: GameService;

  private readonly lobbies: Map<Lobby["id"], Lobby> = new Map<Lobby["id"], Lobby>();

  constructor(private readonly service: GameService) {
    this.gameApiService = service;
  }

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

  public joinLobby(lobbyMode: LobbyMode, gameMode: GameMode, client: AuthenticatedSocket): void {
    let lobbyToJoin = null;
    let paddleSide: PaddleSide = "right";

    if (lobbyMode === "duo") {
      for (const [, lobby] of this.lobbies) {
        if (lobby.status === "waiting" && lobby.gameMode === gameMode && lobby.clients.size < lobby.maxClients) {
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

  public viewGame(lobbyId: string, client: AuthenticatedSocket): void {
    const lobby = this.lobbies.get(lobbyId);
    if (lobby) {
      lobby.viewGame(client);
    }
  }

  @Cron("*/5 * * * *")
  private cleanLobbies(): void {
    for (const [, lobby] of this.lobbies) {
      const now = new Date().getTime();
      const lobbyCreatedAt = lobby.createdAt.getTime();
      const lobbyLifetime = now - lobbyCreatedAt;

      if (lobbyLifetime > LOBBY_MAX_LIFETIME) {
        lobby.dispatchToLobby(ServerEvents.GameEnd, "");

        lobby.gameLoop.stop();

        this.lobbies.delete(lobby.id);
      }
    }
  }
}
