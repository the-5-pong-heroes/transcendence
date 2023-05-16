import { useEffect, useState } from "react";

import { ServerEvents, type LobbyState } from "@Game/@types";
import { useSocketContext } from "@hooks";
import type { SocketContextParameters } from "@types";

interface GameListValues {
  gameList: LobbyState[];
}

export const useGameList = (): GameListValues => {
  const { socketRef }: SocketContextParameters = useSocketContext();
  const [gameList, setGameList] = useState<LobbyState[]>([]);

  const handleGameList = (games: LobbyState[]): void => {
    setGameList(games);
  };

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) {
      return;
    }
    socket.on(ServerEvents.GameList, handleGameList);

    return (): void => {
      socket.off(ServerEvents.GameList);
    };
  }, [socketRef]);

  return { gameList };
};
