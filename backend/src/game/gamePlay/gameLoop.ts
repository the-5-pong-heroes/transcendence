import { Server } from "socket.io";
// import { Pong } from "./pongCore";
import { Pong } from "shared/pongCore";
import { ServerEvents, AuthenticatedSocket, PaddleSide, PaddleMove, CollisionSide, GameState, PaddleState } from "../@types";
import { Lobby } from "../lobby";
import { SCORE_MAX } from "../constants";
import { Play } from "./play";
import { Score } from "./score";

export class GameLoop {
  public readonly pong: Pong;
  public readonly score: Score;
  public readonly play: Play;
  private intervalId: NodeJS.Timeout | undefined;
  private lastTime = 0;
  private lastUpdate = 0;

  constructor(private readonly lobby: Lobby, private readonly server: Server,) {
    this.score = new Score();
    this.play = new Play();
    this.pong = new Pong();
  }

  private gameLoop(delta: number, time: number) {
    if (this.play.paused) {
      return;
    }
    const currentTime = Date.now();
    const timeSinceLastUpdate = currentTime - this.lastUpdate;

    if (this.lobby.lobbyMode === "solo" && this.pong.ball.velX < 0) {
      this.handlePaddleBot();
    }

    this.update(delta);
    // this.lobby.dispatchToLobby(ServerEvents.GameUpdate, this.pong);

    if (timeSinceLastUpdate > 100) {
      this.lastUpdate = currentTime;
      this.lobby.dispatchToLobby(ServerEvents.GameUpdate, this.pong);
    }
  }

  private handlePaddleBot(): void {
    const distance = this.pong.ball.posY - this.pong.paddle.left.posY;
    const lastBotMove = this.pong.paddle.left.lastMove;
    let move: PaddleMove;
  
    if (distance < -5) {
      move = "down";
    } else if (distance > 5) {
      move = "up";
    } 
    else {
      move = "stop";
    }
    if (move != lastBotMove) {
      this.botMove(move);
    }
  }

  private update(delta: number) {
    this.pong.update(delta);
    const collisionSide = this.pong.detectCollisions();
    this.handleMissedCollision(collisionSide);
  }

  public initScore(): void {
    this.score.player1 = 0;
    this.score.player2 = 0;
    this.score.round = 0;
  }

  public start(): void {
    // this.lobby.dispatchToLobby(ServerEvents.ScoreUpdate, this.score.getState());
    this.play.start();
    this.lobby.dispatchToLobby(ServerEvents.PlayUpdate, this.play.getState());
    this.lastTime = Date.now();
    this.lastUpdate = Date.now();
    this.intervalId = setInterval(() => {
      const time = Date.now();
      this.gameLoop(time - this.lastTime, time);
      this.lastTime = time;
    }, 1000 / 60);
  }

  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  public pause(): void {
    if (!this.play.started) {
      return;
    }
    this.play.pause();
    if (this.play.started && this.play.paused) {
      this.stop();
    } else if (this.play.started && !this.play.paused) {
      this.start();
    }
    this.lobby.dispatchToLobby(ServerEvents.PlayUpdate, this.play.getState());
  }

  handleMissedCollision = (collision: CollisionSide): void => {
    if (collision === "none") {
      return ;
    }
    if (collision === "right") {
      this.score.player1 += 1;
    }
    if (collision === "left") {
      this.score.player2 += 1;
    }
    this.score.round++;
    this.lobby.dispatchToLobby(ServerEvents.ScoreUpdate, { score: this.score.getState(), play: this.play.getState() });
    if (this.score.player1 < SCORE_MAX && this.score.player2 < SCORE_MAX) {
      return this.pong.initRound(this.score.round);
    }
    this.play.stop();
    this.lobby.endGame(this.score.player1 === SCORE_MAX ? "left" : "right");
    this.pong.initRound(this.score.round);
  };

  setUser(client: AuthenticatedSocket, side: PaddleSide): void {
    if (side === "left") {
      // console.log(`[setUser left: ${client.id}]`);
      client.data.paddle = this.pong.paddle.left;
    } else if (side === "right") {
      // console.log(`[setUser right: ${client.id}]`);
      client.data.paddle = this.pong.paddle.right;
    }
  }

  public botMove(move: PaddleMove): void {
    // console.log(move);
    this.pong.updatePaddleVelocity("left", move);
    for (const [lobbyClientId, lobbyClient] of this.lobby.clients) {
      this.server.to(lobbyClientId).emit(ServerEvents.PaddleUpdate, { side: "left", move: move });
    }
  }

  public userMove(client: AuthenticatedSocket, move: PaddleMove): void {
    for (const [lobbyClientId, lobbyClient] of this.lobby.clients) {
      if (lobbyClientId !== client.id && move !== client.data.paddle.lastMove) {
        this.server.to(lobbyClientId).emit(ServerEvents.PaddleUpdate, { side: client.data.paddle.side, move: move });
        // console.log(client.data.paddle.lastMove);
      }
    }
    this.pong.updatePaddleVelocity(client.data.paddle.side, move);
  }

  public getState(): GameState {
    return {
      ball: this.pong.ball.getState(),
      paddleRight: this.pong.paddle.right.getState(),
      paddleLeft: this.pong.paddle.left.getState(),
      score: this.score.getState(),
      play: this.play.getState(),
    };
  };

  public getOpponentPaddleState(paddleSide: PaddleSide | null): PaddleState {
    if (paddleSide && paddleSide === "left") {
      return this.pong.paddle.right.getState();
    }
    return this.pong.paddle.left.getState();
  };
}
