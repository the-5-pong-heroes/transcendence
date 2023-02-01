import type { ScoreState, GameSide, GameState, PlayState } from "../@types";
import { getInitialGameState } from "../helpers";
import type { GameOverlayRef } from "../../GameOverlay";
import { SCORE_MAX } from "../constants";

interface MissedCollisionParameters {
  collisionSide: GameSide;
  width: number;
  height: number;
  depth: number;
  score: ScoreState;
  gameRef: React.MutableRefObject<GameState>;
  overlayRef: React.RefObject<GameOverlayRef>;
  playRef: React.MutableRefObject<PlayState>;
}

export const handleMissedCollision = ({
  collisionSide,
  width,
  height,
  depth,
  score,
  gameRef,
  overlayRef,
  playRef,
}: MissedCollisionParameters): void => {
  if (collisionSide === "right") {
    score.player1 += 1;
  }
  if (collisionSide === "left") {
    score.player2 += 1;
  }
  score.round++;
  overlayRef.current?.showScore(score);

  if (score.player1 < SCORE_MAX && score.player2 < SCORE_MAX) {
    gameRef.current = getInitialGameState({ width, height, depth, score });

    return;
  }

  gameRef.current = getInitialGameState({ width, height, depth });
  playRef.current.paused = true;
  playRef.current.started = false;
  overlayRef?.current?.resetGame();
};
