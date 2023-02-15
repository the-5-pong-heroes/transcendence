import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { GameService } from "./game.service";
import { Game } from "./lib";
import { CreateGameDto } from "./dto/create-game.dto";
import { UserMoveDto } from "./dto/update-game.dto";
import { Socket, Server } from "socket.io";
import { GameStateDto } from "./dto/game.dto";

@WebSocketGateway({
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  },
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server; // = socket.io server under the hood
  private readonly gameService: GameService;
  private game: Game;

  constructor(gameService: GameService) {
    this.gameService = gameService;
  }

  afterInit(server: Server) {}

  @SubscribeMessage("connectGame")
  connect(
    @MessageBody() createGameDto: CreateGameDto,
    @ConnectedSocket() client: Socket,
  ) {
    client.emit("initGame", this.getDto());
    // console.log("initGame");
  }

  @SubscribeMessage("startGame")
  start(
    @MessageBody() createGameDto: CreateGameDto,
    @ConnectedSocket() client: Socket,
  ) {
    this.game.on("updateGame", (data) => {
      this.server.emit("updateGame", data);
    });
    this.game.on("updateScore", (data) => {
      this.server.emit("updateScore", data);
    });
    this.game.on("resetGame", (data) => {
      this.server.emit("resetGame", data);
    });
    this.gameService.start();
  }

  @SubscribeMessage("pauseGame")
  pause(
    @MessageBody() createGameDto: CreateGameDto,
    @ConnectedSocket() client: Socket,
  ) {
    this.gameService.pause();
  }

  @SubscribeMessage("movePlayer")
  updatePaddle(
    @MessageBody() userMove: UserMoveDto,
    @ConnectedSocket() client: Socket,
  ) {
    this.gameService.handleUserMove(userMove);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`[Client connected: ${client.id}]`);
    this.game = new Game({ userId: client.id });
    this.gameService.init(this.game);
    this.server.emit("open", { message: "WebSocket connection established" });
  }

  handleDisconnect(client: Socket) {
    console.log(`[Client disconnected: ${client.id}]`);
  }

  getDto(): GameStateDto {
    return this.gameService.getDto();
  }
}
