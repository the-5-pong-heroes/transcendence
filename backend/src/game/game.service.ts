import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { Server, Socket } from "socket.io";
import { LobbyMode, GameMode, AuthenticatedSocket, ServerEvents, LobbyState, PaddleMove } from "./@types";
import { GameLobby } from "./game.lobby";
import { PrismaService } from "../database/prisma.service";
import { UserService } from "src/user/user.service";

const LOBBY_MAX_LIFETIME = 1000 * 60 * 60;

@Injectable()
export class GameService {
  public server!: Server;

  /* lobbies: Map <lobbyId, Lobby> */
  private readonly lobbies: Map<GameLobby["id"], GameLobby> = new Map<GameLobby["id"], GameLobby>();

  /* connectedSockets: Map <socketId, userId> */
  public readonly connectedSockets: Map<AuthenticatedSocket["id"], AuthenticatedSocket> = new Map<
    Socket["id"],
    AuthenticatedSocket
  >();

  constructor(private readonly prisma: PrismaService, private readonly userService: UserService) {}

  /***************     SETUP    ***************/

  public connectToGame(client: AuthenticatedSocket): void {
    client.emit(ServerEvents.GameList, this.getListOfLobbies());
    client.data.readyToPlay = true;
  }

  public disconnectToGame(client: AuthenticatedSocket): void {
    client.emit(ServerEvents.GameList, this.getListOfLobbies());
    client.data.readyToPlay = false;
  }

  public setupClient(client: AuthenticatedSocket): void {
    if (!client.handshake.auth) {
      return;
    }
    for (const [, socket] of this.connectedSockets) {
      if (socket.data.userId === client.handshake.auth.id) {
        client.emit(ServerEvents.UserAlreadyConnected);
        break;
      }
    }
    this.connectedSockets.set(client.id, client);
    client.data.userName = client.handshake.auth.name;
    client.data.userId = client.handshake.auth.id;
    client.data.readyToPlay = false;
    this.userService.updateStatus(client.data.userId, "ONLINE");
    client.emit(ServerEvents.GameList, this.getListOfLobbies());
    // this.broadcastLobbies();
  }

  private createLobby(lobbyMode: LobbyMode, gameMode: GameMode, client: AuthenticatedSocket): GameLobby {
    const lobby = new GameLobby(this.server, gameMode, lobbyMode, this, this.prisma, this.userService);
    this.lobbies.set(lobby.id, lobby);
    lobby.addPlayer(client, "right");
    return lobby;
  }

  /************    JOIN LOBBY   ************/

  public joinLobby(lobbyMode: LobbyMode, gameMode: GameMode, client: AuthenticatedSocket): void {
    let lobby = null;

    if (lobbyMode === "solo") {
      lobby = this.createLobby(lobbyMode, gameMode, client);
      lobby.status = "running";
      return this.startGame(lobby);
    }
    lobby = this.findLobbyToJoin(gameMode, client);
    if (lobby) {
      lobby.addPlayer(client, "left");
      lobby.displayMessage(client, `${client.data.userName} joined the game`);
      return this.startGame(lobby);
    }
    lobby = this.createLobby(lobbyMode, gameMode, client);
    lobby.dispatchLobbyState();
    this.broadcastLobbies();
  }

  public joinLobbyById(lobbyId: string, client: AuthenticatedSocket): void {
    const lobbyToJoin = this.lobbies.get(lobbyId);
    if (lobbyToJoin) {
      if (lobbyToJoin.checkOpponentId(client)) {
        lobbyToJoin.addPlayer(client, "left");
        lobbyToJoin.displayMessage(client, `${client.data.userName} joined the game`);
        lobbyToJoin.startGame();
        lobbyToJoin.dispatchLobbyState();
        this.broadcastLobbies();
      } else {
        client.emit(ServerEvents.PlayerAlreadySet);
      }
    }
  }

  private findLobbyToJoin(gameMode: GameMode, client: AuthenticatedSocket): GameLobby | null {
    for (const [, lobby] of this.lobbies) {
      if (lobby.status === "waiting" && lobby.gameMode === gameMode && lobby.checkOpponentId(client)) {
        return lobby;
      }
    }

    return null;
  }

  /************    START GAME    ************/

  private startGame(lobby: GameLobby): void {
    lobby.startGame();
    lobby.dispatchLobbyState();
    this.broadcastLobbies();
  }

  /************     VIEW GAME    ************/

  public viewGame(lobbyId: string, client: AuthenticatedSocket): void {
    const lobby = this.lobbies.get(lobbyId);
    if (lobby) {
      lobby.addClient(client);
    }
  }

  /************    INVITE GAME   ************/

  public async inviteToGame(userId: string, client: AuthenticatedSocket): Promise<void> {
    for (const [socketId, socket] of this.connectedSockets) {
      if (userId === socket.data.userId) {
        await this.waitForClientIsOnline(socket);
        this.server.to(socketId).emit(ServerEvents.GameInvite, { socketId: client.id, userName: client.data.userName });
      }
    }
  }

  public async inviteToGameResponse(response: boolean, senderId: string, client: AuthenticatedSocket): Promise<void> {
    const sender = this.connectedSockets.get(senderId);
    if (sender === undefined) {
      response &&
        client.emit(ServerEvents.LobbyMessage, "Too late, the sender of the invitation is no longer available...");
      return;
    }
    const senderStatus = await this.userService.getStatus(sender?.data.userId);
    if (senderStatus !== "ONLINE") {
      response &&
        client.emit(ServerEvents.LobbyMessage, "Too late, the sender of the invitation is no longer available...");
      return;
    }
    if (response) {
      sender.emit(
        ServerEvents.LobbyMessage,
        `Your invitation to play send to ${client.data.userName} has been accepted 🤝`,
      );
      /* Create lobby */
      const newLobby = this.createLobby("duo", "2D", sender);
      newLobby.addPlayer(client, "left");
      newLobby.dispatchToLobby(ServerEvents.GameInviteStart, null);
      await this.waitForPlayerIsReady(client);
      await this.waitForPlayerIsReady(sender);
      this.startGame(newLobby);
    } else {
      sender.emit(ServerEvents.LobbyMessage, `Your invitation send to ${client.data.userName} has been declined...`);
    }
  }

  /************   WAIT FOR CLIENT   ************/

  async waitForClientIsOnline(client: AuthenticatedSocket): Promise<void> {
    const clientStatus = await this.userService.getStatus(client?.data.userId);

    if (clientStatus === "ONLINE") {
      return; // Player is already ready, no need to wait
    }

    return new Promise<void>((resolve) => {
      const interval = setInterval(async () => {
        const clientStatus = await this.userService.getStatus(client?.data.userId);
        console.log("🙇‍♀️ senderStatus", clientStatus);
        if (clientStatus === "ONLINE") {
          clearInterval(interval);
          resolve();
        }
      }, 3000);
    });
  }

  async waitForPlayerIsReady(client: AuthenticatedSocket): Promise<void> {
    if (client.data.readyToPlay) {
      return; // Player is already ready, no need to wait
    }

    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (client.data.readyToPlay) {
          clearInterval(interval);
          resolve();
        }
      }, 1000);
    });
  }

  /************    USER ACTIONS   ************/

  public userMove(client: AuthenticatedSocket, move: PaddleMove): void {
    const lobby = client.data.lobby;
    if (lobby) {
      lobby.gameLoop.userMove(client, move);
    }
  }

  public pauseGame(client: AuthenticatedSocket): void {
    const lobby = client.data.lobby;
    if (lobby) {
      lobby.gameLoop.pause();
    }
  }

  /***************    CLEANUP    ***************/

  public removeLobby(lobbyId: string): void {
    this.lobbies.delete(lobbyId);
    this.broadcastLobbies();
  }

  public removeSocket(client: AuthenticatedSocket): void {
    const lobby = client.data.lobby;
    lobby?.removeClient(client);
    this.connectedSockets.delete(client.id);
    this.userService.updateStatus(client.data.userId, "OFFLINE");
  }

  public removeClient(client: AuthenticatedSocket): void {
    const lobby = client.data.lobby;
    lobby?.removeClient(client);
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
        this.removeLobby(lobby.id);
      }
    }
  }

  /**************     UTILS     **************/

  private getListOfLobbies(): LobbyState[] {
    const listOfLobbies: LobbyState[] = Array.from(this.lobbies.values()).map((lobby) => ({
      id: lobby.id,
      userLeft: lobby.player["left"] ? lobby.player["left"]?.name : "user1",
      userRight: lobby.player["right"] ? lobby.player["right"]?.name : "user2",
      status: lobby.status,
      mode: lobby.lobbyMode,
      gameMode: lobby.gameMode,
    }));

    return listOfLobbies;
  }

  private broadcastLobbies(): void {
    const listOfLobbies: LobbyState[] = this.getListOfLobbies();
    this.server.emit(ServerEvents.GameList, listOfLobbies);
    this.displayLobbies();
  }

  private displayLobbies(): void {
    const lobbiesArray = Array.from(this.lobbies.values());
    const lobbyIds = lobbiesArray.map((lobby) => lobby.id);
    console.log("lobbies:", lobbyIds);
  }
}
