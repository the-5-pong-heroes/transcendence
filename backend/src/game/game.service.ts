import { Injectable } from "@nestjs/common";
import { CreateGameDto } from "./dto/create-game.dto";
import { UserMoveDto } from "./dto/update-game.dto";
import { GameStateDto } from "./dto/game.dto";
import { Game } from "./lib";
import { PADDLE_VELOCITY_RATIO } from "./constants";

@Injectable()
export class GameService {
  private game: Game | undefined;
  private intervalId: NodeJS.Timeout | undefined;
  private lastTime = 0;

  init(game: Game) {
    this.game = game;
  }

  create(createGameDto: CreateGameDto) {}

  start() {
    this.game?.start();
    this.lastTime = Date.now();
    this.intervalId = setInterval(() => {
      const time = Date.now();
      this.gameLoop(time - this.lastTime);
      this.lastTime = time;
    }, 1000 / 60);
  }

  private gameLoop(delta: number) {
    if (this.game?.play.paused) {
      return;
    }
    delta /= 10; // not sure about this
    // console.log("delta", delta);
    this.game?.update(delta);
  }

  handleUserMove(userMove: UserMoveDto) {
    // console.log(userMove);
    if (userMove.move === "up") {
      this.game?.updatePaddleVel(PADDLE_VELOCITY_RATIO);
    } else if (userMove.move === "down") {
      this.game?.updatePaddleVel(-PADDLE_VELOCITY_RATIO);
    } else if (userMove.move === "stop") {
      this.game?.updatePaddleVel(0);
    }
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  pause() {
    if (!this.game?.play.started) {
      return;
    }
    this.game?.pause();
    if (this.game?.play.started && this.game?.play.paused) {
      this.stop();
    } else if (this.game?.play.started && !this.game?.play.paused) {
      this.start();
    }
  }
}
