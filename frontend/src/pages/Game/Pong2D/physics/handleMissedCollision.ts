import type { GameAction, ScoreState, GameSide, PlayState } from "../@types";
import { getInitialGameState } from "../helpers";
import type { GameOverlayRef } from "../../GameOverlay";
import { SCORE_MAX } from "../constants";

interface MissedCollisionParameters {
  collisionSide: GameSide;
  width: number;
  height: number;
  score: ScoreState;
  dispatch(value: GameAction): void;
  overlayRef: React.RefObject<GameOverlayRef>;
  playRef: React.MutableRefObject<PlayState>;
}

export const handleMissedCollision = ({
  collisionSide,
  width,
  height,
  score,
  dispatch,
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
    return dispatch({
      type: "update",
      data: getInitialGameState({ width, height, score }),
    });
  }

  dispatch({
    type: "reset",
    data: getInitialGameState({ width, height }),
  });
  playRef.current.paused = true;
  playRef.current.started = false;
  overlayRef?.current?.resetGame();
};
