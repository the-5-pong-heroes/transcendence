import React from "react";
import { Link } from "react-router-dom";

interface ButtonProps {
  icon: string;
  path: string;
  label: string;
  menuRef: React.RefObject<HTMLDivElement>;
  showNavbar: boolean;
  handleShowNavbar: () => void;
}

const _MenuButton: React.FC<ButtonProps> = ({ icon, path, label, menuRef, showNavbar, handleShowNavbar }) => {
  const onClick = (): void => {
    menuRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    if (showNavbar) {
      handleShowNavbar();
    }
  };

  return (
    <li className="nav-item">
      <Link to={path} onClick={onClick}>
        <img src={icon} alt={label} />
      </Link>
    </li>
  );
};

export const MenuButton = React.memo(_MenuButton);
