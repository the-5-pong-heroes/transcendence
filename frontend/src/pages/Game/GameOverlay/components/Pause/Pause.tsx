import React from "react";

import { PauseIcon } from "@assets";
import "./Pause.css";

export const Pause: React.FC = () => {
  return (
    <div className="pause-container fadeOut">
      <img src={PauseIcon} className="pause-icon" />
    </div>
  );
};
