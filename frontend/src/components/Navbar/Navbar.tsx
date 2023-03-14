import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./Navbar.css";
import { menuItems } from "./menuItems";

export const Navbar: React.FC = () => {
  const [showNavbar, setShowNavbar] = useState<boolean>(false);

  const handleShowNavbar = (): void => {
    setShowNavbar(!showNavbar);
  };

  return (
    <div className="navbar">
      <div className="menu-icon" onClick={handleShowNavbar}>
        <img src="menu.png" className="burger" />
      </div>
      {/* <div className="title">transcendence</div> */}
      <div className={`nav-elements ${showNavbar ? "active" : ""}`}>
        <ul>
          {menuItems.map((item) => (
            <li className="item" key={item.label}>
              <Link to={item.path}>
                <img src={item.icon} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
