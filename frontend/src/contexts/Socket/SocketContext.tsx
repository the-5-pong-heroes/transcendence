import React from "react";

import type { SocketContextParameters } from "@types";

export const SocketContext = React.createContext<SocketContextParameters | undefined>(undefined);
