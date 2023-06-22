import { Server } from "socket.io";
import { Pong } from "shared/pongCore";

import {
  ServerEvents,
  AuthenticatedSocket,
  PaddleSide,
  PaddleMove,
  CollisionSide,
  GameState,
  PaddleState,
} from "../@types";
import { GameLobby } from "../game.lobby";
import { SCORE_MAX, DELAY_START_GAME } from "../constants";
import { Play } from "./play";
import { Score } from "./score";

export class GameLoop {
  public readonly pong: Pong;
  public readonly score: Score;
  public readonly play: Play;
  private intervalId: NodeJS.Timeout | undefined;
  private lastTime = 0;
  private lastUpdate = 0;
  private lastPaddleBotUpdate = 0;

  constructor(private readonly lobby: GameLobby, private readonly server: Server) {
    this.score = new Score();
    this.play = new Play();
    this.pong = new Pong();
  }

  /***************     SETUP    ***************/

  setPlayer(client: AuthenticatedSocket, side: PaddleSide): void {
    if (side === "left") {
      client.data.paddle = this.pong.paddle.left;
    } else if (side === "right") {
      client.data.paddle = this.pong.paddle.right;
    }
  }

  public initScore(): void {
    this.score.player1 = 0;
    this.score.player2 = 0;
    this.score.round = 0;
  }

  /**************   GAME LOGIC   **************/

  private gameLoop(delta: number) {
    if (this.play.paused) {
      return;
    }
    const currentTime = Date.now();
    const timeSinceLastUpdate = currentTime - this.lastUpdate;
    const timeSinceLastPaddleBotUpdate = currentTime - this.lastPaddleBotUpdate;
    if (this.lobby.lobbyMode === "solo" && timeSinceLastPaddleBotUpdate > Math.random() * 1000) {
      this.lastPaddleBotUpdate = currentTime;
      this.handlePaddleBot();
    }
    this.update(delta);
    if (timeSinceLastUpdate > 20) {
      this.lastUpdate = currentTime;
      this.lobby.dispatchToLobby(ServerEvents.GameUpdate, this.pong.getState());
    }
  }

  private handlePaddleBot(): void {
    const distance = this.pong.ball.posY - this.pong.paddle.left.posY;
    const lastBotMove = this.pong.paddle.left.lastMove;
    const ballVelY = this.pong.ball.velY;
    let move: PaddleMove;

    if (ballVelY < 0 && distance < -5) {
      move = "down";
    } else if (ballVelY > 0 && distance > 5) {
      move = "up";
    } else {
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

  public start(): void {
    this.lobby.dispatchToLobby(ServerEvents.GameStart, Date.now() + DELAY_START_GAME);
    setTimeout(this.startGame.bind(this), DELAY_START_GAME);
  }

  private startGame(): void {
    this.play.start();
    this.lastTime = Date.now();
    this.lastUpdate = Date.now();
    this.lastPaddleBotUpdate = Date.now();
    this.intervalId = setInterval(() => {
      const time = Date.now();
      this.gameLoop(time - this.lastTime);
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
      this.lobby.dispatchToLobby(ServerEvents.PlayUpdate, this.play.getState());
      this.stop();
    } else if (this.play.started && !this.play.paused) {
      this.start();
    }
  }

  handleMissedCollision = (collision: CollisionSide): void => {
    if (collision === "none") {
      return;
    }
    if (collision === "right") {
      this.score.player1 += 1;
    }
    if (collision === "left") {
      this.score.player2 += 1;
    }
    this.score.round++;
    this.lobby.dispatchToLobby(ServerEvents.ScoreUpdate, { score: this.score.getState(), play: this.play.getState() });
    if (this.score.player1 === SCORE_MAX || this.score.player2 === SCORE_MAX) {
      this.endGame();
    }
    this.pong.initRound(this.score.round);
  };

  endGame = (): void => {
    const winner = this.score.player1 === SCORE_MAX ? "left" : "right";
    const loser = this.score.player1 === SCORE_MAX ? "right" : "left";
    this.play.stop();
    this.stop();
    this.lobby.endGame(winner, loser);
  };

  public botMove(move: PaddleMove): void {
    this.pong.updatePaddleVelocity("left", move);
    for (const [lobbyClientId] of this.lobby.clients) {
      this.server.to(lobbyClientId).emit(ServerEvents.PaddleUpdate, { side: "left", move: move });
    }
  }

  public userMove(client: AuthenticatedSocket, move: PaddleMove): void {
    for (const [lobbyClientId] of this.lobby.clients) {
      if (lobbyClientId !== client.id && move !== client.data.paddle?.lastMove) {
        this.server.to(lobbyClientId).emit(ServerEvents.PaddleUpdate, { side: client.data.paddle?.side, move: move });
      }
    }
    client.data.paddle && this.pong.updatePaddleVelocity(client.data.paddle.side, move);
  }

  /**************     UTILS     **************/

  public isInPause(): boolean {
    return this.play.started && this.play.paused;
  }

  public getState(): GameState {
    return {
      ball: this.pong.ball.getState(),
      paddleRight: this.pong.paddle.right.getState(),
      paddleLeft: this.pong.paddle.left.getState(),
      score: this.score.getState(),
      play: this.play.getState(),
    };
  }

  public getOpponentPaddleState(paddleSide: PaddleSide | null): PaddleState {
    if (paddleSide && paddleSide === "left") {
      return this.pong.paddle.right.getState();
    }
    return this.pong.paddle.left.getState();
  }
}
