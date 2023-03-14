import React from "react";
import { Route, Routes } from "react-router-dom";

import { Navbar } from "./components";
import { Home, Login, Game, Leaderboard, Chat, NotFound } from "./pages";
import "./App.css";
import { SocketContextProvider } from "./contexts";

const App: React.FC = () => {
  return (
    <SocketContextProvider>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Game" element={<Game />} />
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
