export type PaddleStateDto = {
  posX: number;
  posY: number;
  posZ: number;
  height: number;
  width: number;
  depth: number;
};

export type BallStateDto = {
  radius: number;
  posX: number;
  posY: number;
  posZ: number;
  rot: number;
};

export type ScoreStateDto = {
  player1: number;
  player2: number;
};

export type PlayStateDto = {
  started: boolean;
  paused: boolean;
};

export type GameStateDto = {
  ball: BallStateDto;
  paddleRight: PaddleStateDto;
  paddleLeft: PaddleStateDto;
  score: ScoreStateDto;
  play: PlayStateDto;
};
