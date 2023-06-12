import React, { useState } from "react";
import { Link } from "react-router-dom";

import { MenuButton, ScrollToPage, BurgerButton } from "./components";
import "./Navbar.css";
import { type MenuRefs, menuItems } from "./menuItems";

import { handleOnClickButton } from "@/helpers";
import { useAppContext } from "@hooks";
import type { AppContextParameters, PageRefs } from "@types";
import { LogoWallE, LogoWallELight } from "@assets";

export const Navbar: React.FC = () => {
  const [showNavbar, setShowNavbar] = useState<boolean>(false);
  const handleShowNavbar = (): void => {
    setShowNavbar(!showNavbar);
    document.body.classList.toggle("open");
  };

  const { theme, pageRefs, gameState, isNavigatingRef }: AppContextParameters = useAppContext();
  const { homeRef, myProfileRef, gameRef, boardRef, chatRef }: PageRefs = pageRefs;

  const menuRefs: MenuRefs = {
    gameRef,
    boardRef,
    chatRef,
    myProfileRef,
  };

  const onClick = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    console.log("🐍", homeRef.current);
    handleOnClickButton({ event, path: "/", menuRef: homeRef, gameState, isNavigatingRef });
  };

  return (
    <div className="navbar" id="navbar">
      <ScrollToPage />
      <BurgerButton showNavbar={showNavbar} handleShowNavbar={handleShowNavbar} />
      <Link to="/" onClick={onClick}>
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
