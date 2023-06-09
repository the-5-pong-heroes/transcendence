import { useNavigate } from "react-router-dom";

import type { AppContextParameters } from "@types";
import { useAppContext } from "@hooks";

export const useCustomNavigate = (): ((path: string) => void) => {
  const navigate = useNavigate();
  const { isNavigatingRef }: AppContextParameters = useAppContext();

  const customNavigate = (path: string): void => {
    isNavigatingRef.current = true;
    navigate(path);
    setTimeout(() => (isNavigatingRef.current = false), 3000);
  };

  return customNavigate;
};
