import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { Socket, Server } from "socket.io";
import { UserMoveDto, LobbyJoinDto, GameViewDto } from "./dto";
import { GameLobbyService } from "./game-lobby.service";
import { AuthenticatedSocket, ClientEvents, SocketExceptions } from "./@types";
import { ServerException } from "./server.exception";

@WebSocketGateway({
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  },
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger: Logger = new Logger(GameGateway.name);

  constructor(private readonly lobbyManager: GameLobbyService) {}

  afterInit(server: Server) {
    this.lobbyManager.server = server;
    this.logger.log("Game server initialized !");
  }

  async handleConnection(client: Socket): Promise<void> {
    // console.log(`[Client connected: ${client.id}]`);
    this.lobbyManager.setupSocket(client as AuthenticatedSocket);
  }

  async handleDisconnect(client: AuthenticatedSocket) {
    // console.log(`[Client disconnected: ${client.id}]`);
    this.lobbyManager.terminateSocket(client);
  }

  @SubscribeMessage(ClientEvents.LobbyJoin)
  onLobbyJoin(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: LobbyJoinDto) {
    this.lobbyManager.joinLobby(data.lobbyMode, data.gameMode, client);
  }

  @SubscribeMessage(ClientEvents.LobbyLeave)
  onLobbyLeave(@ConnectedSocket() client: AuthenticatedSocket) {
    client.data.lobby?.removeClient(client);
  }

  @SubscribeMessage(ClientEvents.GamePause)
  onGamePause(@ConnectedSocket() client: AuthenticatedSocket) {
    if (!client.data.lobby) {
      throw new ServerException(SocketExceptions.LobbyError, "You're not in a lobby");
    }
    client.data.lobby.gameLoop.pause();
  }

  @SubscribeMessage(ClientEvents.UserMove)
  onUserMove(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() userMove: UserMoveDto) {
    if (!client.data.lobby) {
      throw new ServerException(SocketExceptions.LobbyError, "You're not in a lobby");
    }
    client.data.lobby.gameLoop.userMove(client, userMove.move);
  }

  @SubscribeMessage(ClientEvents.GameView)
  onViewGame(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: GameViewDto) {
    this.lobbyManager.viewGame(data.lobbyId, client);
  }
}
