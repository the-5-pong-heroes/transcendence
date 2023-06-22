import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { useAppContext } from "@hooks";
import type { PageRefs } from "@types";

export const ScrollToPage: React.FC = () => {
  const { pathname } = useLocation();
  const { homeRef, myProfileRef, settingsRef, gameRef, boardRef, chatRef, notFoundRef }: PageRefs =
    useAppContext().pageRefs;

  const refs: Record<string, React.RefObject<HTMLDivElement>> = {
    "/": homeRef,
    "/Game": gameRef,
    "/Leaderboard": boardRef,
    "/Chat": chatRef,
    "/Profile": myProfileRef,
    "/Settings": settingsRef,
  };
  let ref = refs[pathname] ?? notFoundRef;
  if (pathname.startsWith("/profile") || pathname.startsWith("/Profile")) {
    ref = myProfileRef;
  }

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [pathname, ref]);

  return null;
};
