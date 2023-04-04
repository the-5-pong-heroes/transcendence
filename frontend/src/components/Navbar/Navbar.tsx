import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";

import { ThemeContext } from "../../contexts";

import "./Navbar.css";
import { menuItems } from "./menuItems";
import { MenuLight, MenuDark } from "../../assets";

export const Navbar: React.FC = () => {
  const [showNavbar, setShowNavbar] = useState<boolean>(false);
  const handleShowNavbar = (): void => {
    setShowNavbar(!showNavbar);
  };
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const themeContext = useContext(ThemeContext);
  if (themeContext === undefined) {
    throw new Error("Undefined ThemeContext");
  }
  const { theme, scrollRef } = themeContext;

  useEffect(() => {
    console.log("**", scrollRef.current);
    const element = document.getElementById(scrollRef.current);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, [scrollRef]);
  
  return (
    <div className="navbar">
      <div className="menu-icon" onClick={handleShowNavbar}>
        <img src={theme === "light" ? MenuLight : MenuDark} className="burger" />
      </div>
      <div className={`nav-elements ${showNavbar ? "active" : ""}`}>
        <ul>
          {menuItems.map((item, index: number) => (
            <li className="nav-item" key={item.label}>
              <Link to={item.path}>
                <img
                  src={
                    theme === "light"
                      ? selectedIndex === index
                        ? item.iconLightSelected
                        : item.iconLight
                      : selectedIndex === index
                      ? item.iconDarkSelected
                      : item.iconDark
                  }
                  key={`${item.label}-${selectedIndex}`}
                  onClick={() => {
                    setSelectedIndex(index);
                    scrollRef.current = item.label;
    const element = document.getElementById(scrollRef.current);
    console.log("**********", element);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
                  }}
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
