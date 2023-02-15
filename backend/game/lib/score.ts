import { ScoreStateDto } from "../dto/game.dto";

export class Score {
  player1: number;
  player2: number;
  round: number;

  constructor() {
    this.set();
  }

  set(score?: Score) {
    this.player1 = score ? score.player1 : 0;
    this.player2 = score ? score.player2 : 0;
    this.round = score ? score.round : 0;
  }

  getDto(): ScoreStateDto {
    return {
      player1: this.player1,
      player2: this.player2,
    };
  }
}
