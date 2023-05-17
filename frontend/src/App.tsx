import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";

import { Navbar, ThemeButton, Container } from "./components";
import { Home, Profile, Game, Leaderboard, Settings, Chat, Login, Signup, NotFound } from "./pages";
import "./App.css";
import { SocketProvider, AppContext } from "./contexts";

const App: React.FC = () => {
  const appContext = useContext(AppContext);
  if (appContext === undefined) {
    throw new Error("Undefined AppContext");
  }
  const { theme, homeRef, profileRef, settingsRef, gameRef, boardRef, chatRef, logRef, signupRef } = appContext;

  return (
    <SocketProvider>
      <div className="App" id={theme}>
        <Navbar />
        <ThemeButton />
        <div className="App-container">
          <Container>
            <Routes>
              <Route path="/" element={<Home homeRef={homeRef} />} />
              <Route path="/Profile" element={<Profile profileRef={profileRef} />} />
              <Route path="/Profile/:uuid" element={<Profile profileRef={profileRef} />} />
              <Route path="/Settings/" element={<Settings settingsRef={settingsRef} />} />
              <Route path="/Game" element={<Game gameRef={gameRef} />} />
              <Route path="/Leaderboard" element={<Leaderboard boardRef={boardRef} />} />
              <Route path="/Chat" element={<Chat chatRef={chatRef} />} />
              <Route path="/Login" element={<Login logRef={logRef} />} />
              <Route path="/Signup" element={<Signup signupRef={signupRef} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Container>
        </div>
      </div>
    </SocketProvider>
  );
};

export default App;
