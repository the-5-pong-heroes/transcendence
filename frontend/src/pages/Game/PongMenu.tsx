import React from "react";

const _PongMenu: React.FC = () => {
  return <h1 id="pong-title">Pong Game</h1>;
};

export const PongMenu = React.memo(_PongMenu);
