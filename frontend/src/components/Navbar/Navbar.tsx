import React, { useState } from "react";
import { Link } from "react-router-dom";

import { MenuButton, ScrollToPage, BurgerButton } from "./components";
import { handleOnClickButton } from "./helpers";
import "./Navbar.css";
import { type MenuRefs, menuItems } from "./menuItems";

import { useAppContext } from "@hooks";
import type { AppContextParameters, PageRefs } from "@types";
import { LogoWallE, LogoWallELight } from "@assets";

export const Navbar: React.FC = () => {
  const [showNavbar, setShowNavbar] = useState<boolean>(false);
  const handleShowNavbar = (): void => {
    setShowNavbar(!showNavbar);
    document.body.classList.toggle("open");
  };

  const { theme, pageRefs, gameState }: AppContextParameters = useAppContext();
  const { homeRef, profileRef, gameRef, boardRef, chatRef }: PageRefs = pageRefs;

  const menuRefs: MenuRefs = {
    gameRef,
    boardRef,
    chatRef,
    profileRef,
  };

  const onClick = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    handleOnClickButton({ event, path: "/", menuRef: homeRef, gameState });
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
