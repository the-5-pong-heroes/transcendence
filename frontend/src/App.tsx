import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";

import { Navbar, ThemeButton, Container } from "./components";
import { Home, Login, Game, Leaderboard, Chat, NotFound } from "./pages";
import "./App.css";
import { SocketProvider, ThemeContext } from "@/contexts";

const App: React.FC = () => {
  const themeContext = useContext(ThemeContext);
  if (themeContext === undefined) {
    throw new Error("Undefined ThemeContext");
  }
  const { theme } = themeContext;

  return (
    <SocketProvider>
      <div className="App" id={theme}>
        <Navbar />
        <ThemeButton />
        <Container>
          <div className="PageContainer">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/Game" element={<Game />} />
              <Route path="/Leaderboard" element={<Leaderboard />} />
              <Route path="/Chat" element={<Chat />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Container>
      </div>
    </SocketProvider>
  );
};

export default App;
