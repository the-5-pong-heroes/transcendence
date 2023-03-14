import { Server } from "socket.io";
import { AuthenticatedSocket, SocketExceptions } from "../@types";
import { LobbyMode, PaddleSide, GameMode } from "../@types";
import { Lobby } from "./lobby";

export class LobbyManager {
  public server!: Server;

  private readonly lobbies: Map<Lobby["id"], Lobby> = new Map<
    Lobby["id"],
    Lobby
  >();

  public setupSocket(client: AuthenticatedSocket): void {
    client.data.lobby = null;
    // client.data.paddleSide = null;
  }

  public terminateSocket(client: AuthenticatedSocket): void {
    client.data.lobby?.removeClient(client);
  }

  private createLobby(lobbyMode: LobbyMode, gameMode: GameMode): Lobby {
    let maxClients = 1;

    if (lobbyMode === "duo") {
      maxClients = 2;
    }

    const lobby = new Lobby(this.server, maxClients, gameMode, lobbyMode);
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
    // console.log(`[JoinLobby ${gameMode} ${lobbyMode}]`);

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
