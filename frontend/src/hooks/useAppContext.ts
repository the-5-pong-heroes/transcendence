import { useContext } from "react";

import { AppContext } from "@/contexts/App";
import type { AppContextParameters } from "@types";

export const useAppContext = (): AppContextParameters => {
  const appContext = useContext(AppContext);
  if (appContext === undefined) {
    throw new Error("Undefined AppContext");
  }

  return appContext;
};
