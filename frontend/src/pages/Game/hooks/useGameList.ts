import { useEffect, useState } from "react";

import { ServerEvents, type LobbyState } from "@Game/@types";
import { useSocketContext, useSocket } from "@hooks";
import type { SocketParameters } from "@types";

interface GameListValues {
  gameList: LobbyState[];
}

export const useGameList = (): GameListValues => {
  const { socket }: SocketParameters = useSocketContext();
  const [gameList, setGameList] = useState<LobbyState[]>([]);

  const handleGameList = (games: LobbyState[]): void => {
    setGameList(games);
  };

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on(ServerEvents.GameList, handleGameList);

    return (): void => {
      socket.off(ServerEvents.GameList);
    };
  }, [socket]);

  return { gameList };
};
