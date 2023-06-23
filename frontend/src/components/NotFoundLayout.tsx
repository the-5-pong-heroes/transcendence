import React from "react";
import { Outlet } from "react-router-dom";

import { Navbar } from "./Navbar";
import { ThemeButton } from "./ThemeButton";

export const NotFoundLayout: React.FC = () => {
  return (
    <>
      <Navbar setGoTo={() => {}} />
      <ThemeButton />
      <Outlet />
    </>
  );
};
