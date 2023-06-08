import React from "react";

import type { AppContextParameters } from "@types";

export const AppContext = React.createContext<AppContextParameters | undefined>(undefined);
