import React from "react";
import { Route, Routes } from "react-router-dom";

import { Navbar } from "./components";
import { Home, Login, Game, PongMenu, Pong2D, Pong3D, Leaderboard, Chat, NotFound } from "./pages";
import "./App.css";
import { SocketContextProvider } from "./contexts/Socket/socket";

const App: React.FC = () => {
  return (
    <SocketContextProvider>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Game" element={<Game />}>
              <Route index element={<PongMenu />} />
              <Route path="/Game/Pong2D" element={<Pong2D />} />
              <Route path="/Game/Pong3D" element={<Pong3D />} />
            </Route>
            <Route path="/Leaderboard" element={<Leaderboard />} />
            <Route path="/Chat" element={<Chat />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </SocketContextProvider>
  );
};

export default App;
