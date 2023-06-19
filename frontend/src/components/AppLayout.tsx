import React from "react";
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
}

export const AppLayout: React.FC<AppLayoutProps> = ({ user }) => {
  const theme = useTheme();

  return user ? (
    <SocketProvider>
      <Navbar />
      <ThemeButton />
      <ScrollToPage />
      <InvitationModal />
      <div className="App-container">
        <Container>
          <Outlet />
          {theme === "dark" && <ShootingStar />}
        </Container>
      </div>
    </SocketProvider>
  ) : (
    <Navigate to="/Login" replace />
  );
};
