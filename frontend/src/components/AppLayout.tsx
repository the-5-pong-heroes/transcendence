import React from "react";
import { Outlet, Navigate } from "react-router-dom";

import { SocketProvider } from "../contexts";

import { Navbar } from "./Navbar";
import { ThemeButton } from "./ThemeButton";
import { Container } from "./Container";
import { InvitationModal } from "./Invitation";

import { type User } from "@types";

interface AppLayoutProps {
  user: User | null;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ user }) => {
  return user ? (
    <SocketProvider>
      <Navbar />
      <ThemeButton />
      <InvitationModal />
      <div className="App-container">
        <Container>
          <Outlet />
        </Container>
      </div>
    </SocketProvider>
  ) : (
    <Navigate to="/Login" replace />
  );
};
