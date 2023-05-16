import React from "react";

import "./ListOfGames.css";
import { type GameContextParameters, type LobbyState, ClientEvents } from "@Game/@types";
import { useGameContext } from "@Game/hooks";
import { useSocketContext, useUser } from "@hooks";
import type { SocketContextParameters } from "@types";

export const ListOfGames: React.FC = () => {
  const { socketRef }: SocketContextParameters = useSocketContext();
  const { gameList, overlayRef }: GameContextParameters = useGameContext();
  const { userAuth } = useUser();
  const userName = userAuth?.user.name;

  const onClick = (game: LobbyState): void => {
    if (game.status === "waiting") {
      if (socketRef.current) {
        socketRef.current?.emit(ClientEvents.GameJoin, { lobbyId: game.id });
      }
    } else {
      socketRef.current?.emit(ClientEvents.GameView, { lobbyId: game.id });
    }
    overlayRef?.current?.startGame(game.mode, game.gameMode);
  };

  if (!gameList || gameList === undefined || !gameList.length) {
    return null;
  }

  return (
    <div className="list-of-games">
      <p className="list-of-games-title">Current Games :</p>
      <ul>
        {gameList.map((game) => (
          <li key={game.id}>
            <div>
              {game.userLeft} <span> ⚔️ </span> {game.userRight}
            </div>
            <div>
              [ <span className={game.status}>{game.status}</span> ]
            </div>
            {/* <div> {game.id.substring(0, 10) + "..."} </div> */}
            <button onClick={() => onClick(game)}>
              {game.status === "waiting"
                ? userName !== game.userLeft && userName !== game.userRight
                  ? "JOIN"
                  : null
                : "VIEW"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
