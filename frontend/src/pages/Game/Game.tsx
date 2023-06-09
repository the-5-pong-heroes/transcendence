import React, { useEffect, useState } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

import "./Game.css";
import { GameOverlay } from "./GameOverlay";
import { Pong2D } from "./Pong2D";
import { Pong3D } from "./Pong3D";
import { PongMenu } from "./PongMenu";
import { GameProvider } from "./context/GameProvider";
import { useGameSize, useGameEvents } from "./hooks";

import type { SocketParameters } from "@types";
import { useSocketContext } from "@hooks";

interface GameProps {
  gameRef: React.RefObject<HTMLDivElement>;
}

const fallbackRender: React.FC<FallbackProps> = ({ error }) => {
  return (
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

// interface FadeOutProps {
//   children: React.ReactNode;
// }

// const FadeOutComponent: React.FC<FadeOutProps> = ({ children }) => {
//   const [visible, setVisible] = useState<boolean>(true);

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       setVisible(false);
//     }, 2000); // Adjust the delay time as needed

//     return () => clearTimeout(timeout);
//   }, []);

//   return <div className={`fade-out ${visible ? "visible" : "hidden"}`}>{children}</div>;
// };

interface useFadeProps {
  isVisible: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  fadeProps: {
    style: {
      animation: string;
    };
    onAnimationEnd: () => void;
  };
}

const useFade = (initial: boolean): useFadeProps => {
  const [show, setShow] = useState<boolean>(initial);
  const [isVisible, setVisible] = useState<boolean>(show);

  // Update visibility when show changes
  useEffect(() => {
    if (show) {
      setVisible(true);
    }
  }, [show]);

  // When the animation finishes, set visibility to false
  const onAnimationEnd = (): void => {
    if (!show) {
      setVisible(false);
    }
  };

  const style = { animation: `${show ? "fadeIn" : "fadeOut"} .3s` };

  // These props go on the fading DOM element
  const fadeProps = {
    style,
    onAnimationEnd,
  };

  return { isVisible, setShow, fadeProps };
};

export const Game: React.FC<GameProps> = ({ gameRef }) => {
  const { height, width } = useGameSize();
  const gameStyle: React.CSSProperties = { width, height };
  const { socketReady }: SocketParameters = useSocketContext();
  const { fadeProps } = useFade(true);

  return (
    <div ref={gameRef} id="Game" className={"game-container"} {...fadeProps}>
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
      </div>
    </div>
  );
};
