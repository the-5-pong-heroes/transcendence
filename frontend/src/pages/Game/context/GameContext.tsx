import React from "react";

import type { GameContextParameters } from "../@types";

export const GameContext = React.createContext<GameContextParameters | undefined>(undefined);
