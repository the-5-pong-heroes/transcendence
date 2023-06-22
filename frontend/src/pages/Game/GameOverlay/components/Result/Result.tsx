import React from "react";

import "./Result.css";
import { CloseButton } from "../CloseButton";

import type { GameResult } from "@Game/@types";

interface ResultProps {
  result: GameResult | undefined;
  winner?: string;
  index: number;
}

export const Result: React.FC<ResultProps> = ({ result, winner = "The bot", index }) => {
  if (!result) {
    return null;
  }

  const victoryMessages = [
    "Congratulations! You won 🎉",
    "Wow, what a game! You're the winner 🏆",
    "Victory is yours! 🥳",
    "Incredible! You're on fire! 🔥",
    "You are the champion, my friend 🎶",
  ];

  const defeatMessages = [
    "Sorry, you lost... 🥺",
    "Better luck next time! 🤷‍♂️",
    "Don't worry, losing is just a part of the game 😌",
    "Tough luck... but don't give up! 💪",
    "Don't let this defeat bring you down. Get up and try again! 🙌🏼",
  ];

  return (
    <div id="result-modal" className="game-modal">
      <CloseButton />
      <div>
        {result === "Winner" && (
          <>
            <span className="result">{victoryMessages[index]}</span>
          </>
        )}
        {result === "Loser" && (
          <>
            <span className="result">{defeatMessages[index]}</span>
          </>
        )}
        {result === "None" && (
          <>
            <span className="result">{winner} won the game! 🏆</span>
          </>
        )}
        {result === undefined && (
          <>
            <span className="result">Unexpected end... 🤷‍♂️</span>
          </>
        )}
      </div>
    </div>
  );
};
