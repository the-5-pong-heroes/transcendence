<<<<<<< HEAD
import React, { useState } from "react";
import { Link } from "react-router-dom";

import { MenuButton, ScrollToPage, BurgerButton } from "./components";
import { handleOnClickButton } from "./helpers";
import "./Navbar.css";
import { type MenuRefs, menuItems } from "./menuItems";

import { useAppContext } from "@hooks";
import type { AppContextParameters, PageRefs } from "@types";
import { LogoWallE, LogoWallELight } from "@assets";
=======
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
>>>>>>> master

export const Navbar: React.FC = () => {
  const [showNavbar, setShowNavbar] = useState<boolean>(false);
  const handleShowNavbar = (): void => {
    setShowNavbar(!showNavbar);
    document.body.classList.toggle("open");
  };

<<<<<<< HEAD
  const { theme, pageRefs, gameState }: AppContextParameters = useAppContext();
  const { homeRef, profileRef, gameRef, boardRef, chatRef }: PageRefs = pageRefs;
=======
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
>>>>>>> master

  const menuRefs: MenuRefs = {
    gameRef,
    boardRef,
    chatRef,
    profileRef,
  };
<<<<<<< HEAD

  const onClick = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    handleOnClickButton({ event, path: "/", menuRef: homeRef, gameState });
  };
=======
>>>>>>> master

  return (
    <div className="navbar" id="navbar">
      <ScrollToPage />
<<<<<<< HEAD
      <BurgerButton showNavbar={showNavbar} handleShowNavbar={handleShowNavbar} />
      <Link to="/" onClick={onClick}>
=======
      <div className={`hamburger-button ${showNavbar ? "active" : ""}`} onClick={handleShowNavbar}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <Link to="/" onClick={handleScroll(homeRef)}>
>>>>>>> master
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
