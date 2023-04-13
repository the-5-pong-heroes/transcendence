/* eslint-disable no-magic-numbers */

import React, { useEffect } from "react";
import "./Countdown.css";

const INTERVAL = 1000;

interface CountdownParameters {
  countdown: number;
  setCountdown: React.Dispatch<React.SetStateAction<number>>;
}

export const Countdown: React.FC<CountdownParameters> = ({ countdown, setCountdown }) => {
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prevCount) => prevCount - 1);
    }, INTERVAL);

    return () => clearInterval(interval);
  }, [setCountdown]);

  return (
    <div key={`digit-${countdown}`} className="countdown fadeOut">
      {countdown}
    </div>
  );
};
