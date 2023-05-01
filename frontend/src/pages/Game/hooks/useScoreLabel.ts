import { useState, useEffect, useCallback, useContext } from "react";

import { computeScoreLabel } from "../helpers";
import type { ScoreState, PlayState } from "../@types";
import { ServerEvents } from "../@types";
import { SocketContext } from "../../../contexts";
import { GameContext } from "../context";

interface ScoreUpdateParameters {
  score: ScoreState;
  play: PlayState;
}

export const useScoreLabel = (): string => {
  const socketContext = useContext(SocketContext);
  if (socketContext === undefined) {
    throw new Error("Undefined SocketContext");
  }
  const { socketRef } = socketContext;

  const gameContext = useContext(GameContext);
  if (gameContext === undefined) {
    throw new Error("Undefined GameContext");
  }
  const { playRef, localPongRef } = gameContext;

  const [scoreLabel, setScoreLabel] = useState<string>(computeScoreLabel({ player1: 0, player2: 0, round: 0 }));

  const updateScore = useCallback(
    (params: ScoreUpdateParameters) => {
      const { score, play } = params;
      setScoreLabel(computeScoreLabel(score));
      localPongRef.current.initRound(score.round);
      playRef.current.started = play.started;
      playRef.current.paused = play.paused;
    },
    [playRef, localPongRef]
  );

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) {
      return;
    }
    socket.on(ServerEvents.ScoreUpdate, updateScore);

    return () => {
      socket.off(ServerEvents.ScoreUpdate);
    };
  }, [socketRef, updateScore]);

  return scoreLabel;
};
