import { useNavigate } from "react-router-dom";

import type { AppContextParameters } from "@types";
import { useAppContext } from "@/hooks/useAppContext";

const NAVIGATION_DELAY = 3000;

export const useCustomNavigate = (): ((path: string) => void) => {
  const navigate = useNavigate();
  const { isNavigatingRef }: AppContextParameters = useAppContext();

  const customNavigate = (path: string): void => {
    isNavigatingRef.current = true;
    navigate(path);
    setTimeout(() => (isNavigatingRef.current = false), NAVIGATION_DELAY);
  };

  return customNavigate;
};
