import { useState, useEffect, useCallback } from "react";

import { computeScoreLabel } from "../helpers";
import type { ScoreState, PlayState, GameContextParameters } from "../@types";
import { ServerEvents } from "../@types";

import { useGameContext } from "./useGameContext";

import { useSocketContext, useSocket } from "@hooks";
import type { SocketParameters } from "@types";

interface ScoreUpdateParameters {
  score: ScoreState;
  play: PlayState;
}

export const useScoreLabel = (): string => {
  const { socket }: SocketParameters = useSocketContext();
  const { playRef, localPongRef }: GameContextParameters = useGameContext();

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
    if (!socket) {
      return;
    }
    socket.on(ServerEvents.ScoreUpdate, updateScore);

    return () => {
      socket.off(ServerEvents.ScoreUpdate);
    };
  }, [socket, updateScore]);

  return scoreLabel;
};
