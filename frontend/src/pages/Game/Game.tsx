import React from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

import "./Game.css";
import { GameOverlay } from "./GameOverlay";
import { Pong2D } from "./Pong2D";
import { Pong3D } from "./Pong3D";
import { PongMenu } from "./PongMenu";
import { GameProvider } from "./context/GameProvider";
import { useGameSize, useGameEvents } from "./hooks";

<<<<<<< HEAD
import type { SocketParameters } from "@types";
import { useSocketContext } from "@hooks";
=======
interface GameProps {
  gameRef: React.RefObject<HTMLDivElement>;
}

export const Game: React.FC<GameProps> = ({ gameRef }) => {
  const { height, width } = useGameSize();
  const gameStyle: React.CSSProperties = { width, height };
  // const mounted = useRef<boolean>(false);

  // useEffect(() => {
  //   mounted.current = true;

  //   return () => {
  //     mounted.current = false;
  //   };
  // }, []);
>>>>>>> master

interface GameProps {
  gameRef: React.RefObject<HTMLDivElement>;
}

const fallbackRender: React.FC<FallbackProps> = ({ error }) => {
  return (
<<<<<<< HEAD
    <div role="alert" className="game-error-fallback">
      <p>ERROR :</p>
      <pre style={{ color: "red" }}>{(error as Error).message}</pre>
    </div>
  );
};

const Pong: React.FC = () => {
  useGameEvents();

  return (
    <>
      <PongMenu />
      <GameOverlay />
      <Pong2D />
      <Pong3D />
    </>
  );
};

export const Game: React.FC<GameProps> = ({ gameRef }) => {
  const { height, width } = useGameSize();
  const gameStyle: React.CSSProperties = { width, height };
  const { socketReady }: SocketParameters = useSocketContext();

  return (
    <div ref={gameRef} id="Game" className="game-container">
      <div className="game" style={gameStyle}>
        <ErrorBoundary
          fallbackRender={fallbackRender}
          onReset={(details) => {
            // Reset the state of your app so the error doesn't happen again
          }}>
          {socketReady ? (
            <GameProvider>
              <Pong />
            </GameProvider>
          ) : (
            <div className="loading-socket">
              <div className="loader"></div>
              <div className="text">Loading...</div>
            </div>
          )}
        </ErrorBoundary>
=======
    <div ref={gameRef} id="Game" className="game-container">
      <div className="game" style={gameStyle}>
        <GameProvider>
          <PongMenu />
          <GameOverlay />
          <Pong2D />
          <Pong3D />
        </GameProvider>
>>>>>>> master
      </div>
    </div>
  );
};
