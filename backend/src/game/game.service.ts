import { Injectable } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { LobbyMode, GameMode, AuthenticatedSocket, ServerEvents, LobbyState, PaddleMove } from "./@types";
import { GameLobby } from "./game.lobby";
import { PrismaService } from "../database/prisma.service";
import { UserService } from "src/user/user.service";
import { AuthService } from "src/auth/auth.service";

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

  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  /***************     SETUP    ***************/

  public connectToGame(client: AuthenticatedSocket): void {
    client.emit(ServerEvents.GameList, this.getListOfLobbies());
    client.data.readyToPlay = true;
  }

  public disconnectToGame(client: AuthenticatedSocket): void {
    client.emit(ServerEvents.GameList, this.getListOfLobbies());
    client.data.readyToPlay = false;
  }

  public async setupClient(client: AuthenticatedSocket): Promise<void> {
    if (!client.handshake.auth) {
      client.disconnect();
    }
    client.data.userName = client.handshake.auth.name;
    client.data.userId = client.handshake.auth.id;
    client.data.readyToPlay = false;
    for (const [, socket] of this.connectedSockets) {
      if (socket.data.userId === client.handshake.auth.id) {
        client.emit(ServerEvents.Connect);
        break;
      }
    }
    this.connectedSockets.set(client.id, client);
    await this.userService.updateStatus(client.handshake.auth.id, "ONLINE");
    client.emit(ServerEvents.GameList, this.getListOfLobbies());
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
      this.startGame(lobby);
      return;
    }
    lobby = this.findLobbyToJoin(gameMode, client);
    if (lobby) {
      lobby.addPlayer(client, "left");
      lobby.displayMessage(client, `${client.data.userName} joined the game`);
      this.startGame(lobby);
      return;
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
        this.startGame(lobbyToJoin);
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

  private async startGame(lobby: GameLobby): Promise<void> {
    await this.delay(1000);
    lobby.startGame();
    lobby.dispatchLobbyState();
    this.broadcastLobbies();
  }

  /************     VIEW GAME    ************/

  public viewGame(lobbyId: string, client: AuthenticatedSocket): void {
    const lobby = this.lobbies.get(lobbyId);
    if (lobby) {
      lobby.addViewer(client);
    }
  }

  /************    INVITE GAME   ************/

  public async inviteToGame(userId: string, client: AuthenticatedSocket): Promise<void> {
    if (userId === client.data.userId) {
      return;
    }
    for (const [socketId, socket] of this.connectedSockets) {
      if (userId === socket.data.userId) {
        await this.waitForClientIsOnline(socket);
        this.server.to(socketId).emit(ServerEvents.GameInvite, { socketId: client.id, userName: client.data.userName });
        break;
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
    this.runInviteToGame(response, sender, client);
  }

  public async inviteToGameLink(userId: string, client: AuthenticatedSocket): Promise<void> {
    for (const [socketId, socket] of this.connectedSockets) {
      if (userId === socket.data.userId) {
        const sender = this.connectedSockets.get(socketId);
        if (sender === undefined) {
          client.emit(ServerEvents.LobbyMessage, "Too late, the sender of the invitation is no longer available...");
          return;
        }
        this.runInviteToGame(true, sender, client);
        break;
      }
    }
  }

  private async runInviteToGame(
    response: boolean,
    sender: AuthenticatedSocket,
    client: AuthenticatedSocket,
  ): Promise<void> {
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

  public async removeSocket(client: AuthenticatedSocket): Promise<void> {
    const lobby = client.data.lobby;
    lobby?.removeClient(client);
    this.connectedSockets.delete(client.id);
    await this.userService.updateStatus(client.handshake.auth.id, "OFFLINE"); // PROBLEM HERE
    for (const [socketId, socket] of this.connectedSockets) {
      if (client.data.userId === socket.data.userId) {
        this.server.to(socketId).emit(ServerEvents.Disconnect, null);
      }
    }
  }

  public removeClient(client: AuthenticatedSocket): void {
    const lobby = client.data.lobby;
    lobby?.removeClient(client);
  }

  /**************     UTILS     **************/

  public delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private getListOfLobbies(): LobbyState[] {
    const listOfLobbies: LobbyState[] = Array.from(this.lobbies.values()).map((lobby) => ({
      id: lobby.id,
      userLeft: lobby.getLeftPlayerName(),
      userRight: lobby.getRightPlayerName(),
      status: lobby.status,
      mode: lobby.lobbyMode,
      gameMode: lobby.gameMode,
    }));

    return listOfLobbies;
  }

  private broadcastLobbies(): void {
    const listOfLobbies: LobbyState[] = this.getListOfLobbies();
    this.server.emit(ServerEvents.GameList, listOfLobbies);
    // this.displayLobbies();
  }

  private displayLobbies(): void {
    const lobbiesArray = Array.from(this.lobbies.values());
    const lobbyIds = lobbiesArray.map((lobby) => lobby.id);
  }
}
