import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Logger, UsePipes, ValidationPipe } from "@nestjs/common";
import { Socket, Server } from "socket.io";
import { UserMoveDto, LobbyJoinDto, GameJoinDto, GameInviteDto, GameInviteResponseDto } from "./dto";
import { GameService } from "./game.service";
import { AuthenticatedSocket, ClientEvents } from "./@types";
import { WsGuard } from "./ws.guard";
import { ALLOWED_ORIGINS } from "src/common/constants";

@WebSocketGateway({
  cors: {
    origin: ALLOWED_ORIGINS,
    credentials: true,
  },
})
@UsePipes(new ValidationPipe({ transform: true }))
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger: Logger = new Logger(GameGateway.name);

  constructor(private readonly gameService: GameService, private readonly wsGuard: WsGuard) {}

  afterInit(server: Server) {
    this.gameService.server = server;
    this.logger.log("Game server initialized !");
  }

  async handleConnection(client: Socket): Promise<void> {
    await this.wsGuard.canActivate(client);
    this.gameService.setupClient(client as AuthenticatedSocket);
  }

  async handleDisconnect(client: AuthenticatedSocket) {
    this.gameService.removeSocket(client);
  }

  @SubscribeMessage(ClientEvents.GameConnect)
  onGameConnect(@ConnectedSocket() client: AuthenticatedSocket) {
    this.gameService.connectToGame(client);
  }

  @SubscribeMessage(ClientEvents.GameDisconnect)
  onGameDisconnect(@ConnectedSocket() client: AuthenticatedSocket) {
    this.gameService.disconnectToGame(client);
  }

  @SubscribeMessage(ClientEvents.LobbyJoin)
  onLobbyJoin(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: LobbyJoinDto) {
    this.gameService.joinLobby(data.lobbyMode, data.gameMode, client);
  }

  @SubscribeMessage(ClientEvents.LobbyLeave)
  onLobbyLeave(@ConnectedSocket() client: AuthenticatedSocket) {
    this.gameService.removeClient(client);
  }

  @SubscribeMessage(ClientEvents.GameJoin)
  onJoinGame(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: GameJoinDto) {
    this.gameService.joinLobbyById(data.lobbyId, client);
  }

  @SubscribeMessage(ClientEvents.UserMove)
  onUserMove(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: UserMoveDto) {
    this.gameService.userMove(client, data.move);
  }

  @SubscribeMessage(ClientEvents.GamePause)
  onGamePause(@ConnectedSocket() client: AuthenticatedSocket) {
    this.gameService.pauseGame(client);
  }

  @SubscribeMessage(ClientEvents.GameView)
  onViewGame(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: GameJoinDto) {
    this.gameService.viewGame(data.lobbyId, client);
  }

  @SubscribeMessage(ClientEvents.GameInvite)
  onInviteGame(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: GameInviteDto) {
    this.gameService.inviteToGame(data.userId, client);
  }

  @SubscribeMessage(ClientEvents.GameInviteResponse)
  onInviteGameResponse(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: GameInviteResponseDto) {
    this.gameService.inviteToGameResponse(data.response, data.senderId, client);
  }
}
