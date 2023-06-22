import React, { Dispatch, SetStateAction } from "react";
import { Outlet, Navigate } from "react-router-dom";

import { SocketProvider } from "../contexts";

import { Navbar } from "./Navbar";
import { ThemeButton } from "./ThemeButton";
import { Container } from "./Container";
import { InvitationModal } from "./Invitation";
import { ShootingStar } from "./ShootingStar";
import { ScrollToPage } from "./Navbar/components/ScrollToPage";

import { type User } from "@types";
import { useTheme } from "@/hooks";

interface AppLayoutProps {
  user: User | null;
  goTo: string;
  setGoTo: Dispatch<SetStateAction<string>>;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ user, goTo, setGoTo }) => {
  const theme = useTheme();
  
  return user ? (
    <SocketProvider>
      <Navbar setGoTo={setGoTo} />
      <ThemeButton />
      <ScrollToPage />
      <InvitationModal />
      <div className="App-container">
        <Container goTo={goTo} setGoTo={setGoTo}>
          <Outlet />
          {theme === "dark" && <ShootingStar />}
        </Container>
      </div>
    </SocketProvider>
  ) : (
    <Navigate to="/Login" replace />
  );
};
