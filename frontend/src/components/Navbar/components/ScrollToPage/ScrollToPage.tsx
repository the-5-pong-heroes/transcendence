import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { useAppContext } from "@hooks";
import type { PageRefs } from "@types";

export const ScrollToPage: React.FC = () => {
  const { pathname } = useLocation();
  const { homeRef, profileRef, myProfileRef, gameRef, boardRef, chatRef, notFoundRef }: PageRefs =
    useAppContext().pageRefs;

  const refs: Record<string, React.RefObject<HTMLDivElement>> = {
    "/": homeRef,
    "/Game": gameRef,
    "/Leaderboard": boardRef,
    "/Chat": chatRef,
    "/Profile": myProfileRef,
    // "/Profile": profileRef,
  };
  const ref = refs[pathname] ?? notFoundRef;

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [pathname, ref]);

  return null;
};
