/* eslint-disable no-magic-numbers */
import { GAME_WIDTH, GAME_HEIGHT } from "./game";

export const BALL_RADIUS_RATIO = 0.025;
export const BALL_OFFSET_RATIO = 0.6;
export const BALL_ACC_X = 0;
export const MAX_BOUNCE_ANGLE = (5 / 12) * Math.PI;
export const INITIAL_BALL_VEL_X = GAME_WIDTH * (2 / 3);
export const INITIAL_BALL_VEL_Y = -GAME_HEIGHT / 8;
