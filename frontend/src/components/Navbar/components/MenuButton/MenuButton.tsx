import React from "react";
import { Link } from "react-router-dom";

import { handleOnClickButton } from "../../helpers";

import { useAppContext } from "@hooks";
import type { AppContextParameters } from "@types";

interface MenuButtonProps {
  icon: string;
  path: string;
  label: string;
  menuRef: React.RefObject<HTMLDivElement>;
  showNavbar: boolean;
  handleShowNavbar: () => void;
}

const _MenuButton: React.FC<MenuButtonProps> = ({ icon, path, label, menuRef, showNavbar, handleShowNavbar }) => {
  const { gameState }: AppContextParameters = useAppContext();

  const onClick = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    handleOnClickButton({ event, path, menuRef, gameState });
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
