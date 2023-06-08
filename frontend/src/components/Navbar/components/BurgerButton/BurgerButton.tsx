import React from "react";

interface BurgerButtonProps {
  showNavbar: boolean;
  handleShowNavbar: () => void;
}

export const BurgerButton: React.FC<BurgerButtonProps> = ({ showNavbar, handleShowNavbar }) => {
  return (
    <div className={`hamburger-button ${showNavbar ? "active" : ""}`} onClick={handleShowNavbar}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};
