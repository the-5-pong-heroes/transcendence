import React from "react";
import { Outlet, Navigate } from "react-router-dom";

import { SocketProvider } from "../contexts";

import { Navbar } from "./Navbar";
import { ThemeButton } from "./ThemeButton";
import { Container } from "./Container";
import { InvitationModal } from "./Invitation";

import { type UserAuth } from "@types";

interface AppLayoutProps {
  userAuth: UserAuth | null;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ userAuth }) => {
  return userAuth ? (
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
