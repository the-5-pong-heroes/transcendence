import { GAME_WIDTH } from "./game";

export const PADDLE_HEIGHT = 80;
export const PADDLE_WIDTH = 15;
export const PADDLE_DEPTH = 120;
export const PADDLE_OFFSET_RATIO = 0.01;
export const PADDLE_VELOCITY = 0.4;
export const RIGHT_PADDLE_X: number = GAME_WIDTH / 2 - PADDLE_WIDTH * 2.5;
export const LEFT_PADDLE_X: number = -GAME_WIDTH / 2 + PADDLE_WIDTH * 2.5;
