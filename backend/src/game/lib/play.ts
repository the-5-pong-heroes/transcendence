import { PlayStateDto } from "../dto/game.dto";

export class Play {
  started: boolean;
  paused: boolean;

  constructor() {
    this.started = false;
    this.paused = true;
  }

  start() {
    this.started = true;
    this.paused = false;
  }

  stop() {
    this.started = false;
    this.paused = true;
  }

  pause() {
    this.paused = !this.paused;
  }

  getDto(): PlayStateDto {
    return {
      started: this.started,
      paused: this.paused,
    };
  }
}
