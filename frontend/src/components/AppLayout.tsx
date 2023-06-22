import React, { Dispatch, SetStateAction } from "react";
import { Outlet, Navigate } from "react-router-dom";

import { SocketProvider } from "../contexts";

import { Navbar } from "./Navbar";
import { ThemeButton } from "./ThemeButton";
import { Container } from "./Container";
import { InvitationModal } from "./Invitation";

import { type User } from "@types";

interface AppLayoutProps {
  user: User | null;
  goTo: string;
  setGoTo: Dispatch<SetStateAction<string>>;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ user, goTo, setGoTo }) => {
  return user ? (
    <SocketProvider>
      <Navbar setGoTo={setGoTo} />
      <ThemeButton />
      <InvitationModal />
      <div className="App-container">
        <Container goTo={goTo} setGoTo={setGoTo}>
          <Outlet />
        </Container>
      </div>
    </SocketProvider>
  ) : (
    <Navigate to="/Login" replace />
  );
};
