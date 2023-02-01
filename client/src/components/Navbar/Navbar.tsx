import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

interface NavbarProps {
  menuItems: {
    label: string;
    path: string;
    submenuItems?: {
      label: string;
      path: string;
    }[];
  }[];
}

const MINUS_ONE = -1;

export const Navbar: React.FC<NavbarProps> = ({ menuItems }) => {
  const [activeIndex, setActiveIndex] = useState<number>(MINUS_ONE);

  const handleHover = useCallback(
    (index: number): void => {
      setActiveIndex(index === activeIndex ? MINUS_ONE : index);
    },
    [activeIndex, setActiveIndex]
  );

  const handleClick = useCallback((): void => {
    setActiveIndex(MINUS_ONE);
  }, [setActiveIndex]);

  return (
    <div className="navbar">
      <ul className="navbar-list">
        {menuItems.map((item, index) => (
          <li
            key={item.label}
            onMouseEnter={() => handleHover(index)}
            onMouseLeave={() => handleHover(MINUS_ONE)}
            onClick={handleClick}>
            <Link to={item.path}>{item.label}</Link>
            {item.submenuItems && (
              <ul className={`sub-menu ${index === activeIndex ? "active" : ""}`}>
                {item.submenuItems.map((subItem) => (
                  <li key={subItem.label}>
                    <Link to={subItem.path}>{subItem.label}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
