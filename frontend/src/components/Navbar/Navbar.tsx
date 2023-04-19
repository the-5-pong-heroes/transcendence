import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { AppContext } from "../../contexts";
import { LogoWallE, LogoWallELight } from "../../assets";
import { MenuButton } from "../MenuButton";

import "./Navbar.css";
import { type MenuRefs, menuItems } from "./menuItems";

export const ScrollToPage: React.FC = () => {
  const { pathname } = useLocation();

  const appContext = useContext(AppContext);
  if (appContext === undefined) {
    throw new Error("Undefined AppContext");
  }
  const { homeRef, profileRef, gameRef, boardRef, chatRef } = appContext;

  const refs: Record<string, React.RefObject<HTMLDivElement>> = {
    "/": homeRef,
    "/Game": gameRef,
    "/Leaderboard": boardRef,
    "/Chat": chatRef,
    "/Profile": profileRef,
  };
  const ref = refs[pathname] ?? homeRef;

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [pathname, ref]);

  return null;
};

export const Navbar: React.FC = () => {
  const [showNavbar, setShowNavbar] = useState<boolean>(false);
  const handleShowNavbar = (): void => {
    setShowNavbar(!showNavbar);
    document.body.classList.toggle("open");
  };

  const handleScroll = (ref: React.RefObject<HTMLDivElement>): (() => void) => {
    return () => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };
  };

  const appContext = useContext(AppContext);
  if (appContext === undefined) {
    throw new Error("Undefined AppContext");
  }
  const { theme, homeRef, profileRef, gameRef, boardRef, chatRef } = appContext;

  const menuRefs: MenuRefs = {
    gameRef,
    boardRef,
    chatRef,
    profileRef,
  };

  return (
    <div className="navbar" id="navbar">
      <ScrollToPage />
      <div className={`hamburger-button ${showNavbar ? "active" : ""}`} onClick={handleShowNavbar}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <Link to="/" onClick={handleScroll(homeRef)}>
        <img src={theme === "light" ? LogoWallELight : LogoWallE} className="logo-wall-e" />
      </Link>
      <div className={`nav-elements ${showNavbar ? "active" : ""}`}>
        <ul>
          {menuItems.map((item) => (
            <MenuButton
              key={item.path}
              icon={theme === "light" ? item.iconLight : item.iconDark}
              path={item.path}
              label={item.label}
              menuRef={menuRefs[item.refName]}
              showNavbar={showNavbar}
              handleShowNavbar={handleShowNavbar}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};
