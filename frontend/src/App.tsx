import React, { useContext, useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import { Navbar, ThemeButton, Container } from "./components";
import { Home, Profile, Game, Leaderboard, Chat, NotFound } from "./pages";
import "./App.css";
import { SocketProvider, ThemeContext } from "@/contexts";

const ScrollTo = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // window.scrollTo(200, 200);
    const element = document.getElementById(pathname);
    if (element) {
      console.log(pathname);
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [pathname]);

  return null;
}

const App: React.FC = () => {
  const themeContext = useContext(ThemeContext);
  if (themeContext === undefined) {
    throw new Error("Undefined ThemeContext");
  }
  const { theme } = themeContext;

  // const	[scroll, setScroll] = useState<string>("Home");

  // useEffect(() => {
	// const element = document.getElementById(scroll);
  //   if (element) {
  //     console.log(scroll);
  //     element.scrollIntoView({ behavior: 'smooth' });
  //   }
  // }, [scroll])

  return (
    <SocketProvider>
      <ScrollTo />
      <div className="App" id={theme}>
        <Navbar />
        <ThemeButton />
        <Container>
          <div className="PageContainer">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Profile" element={<Profile />} />
              <Route path="/Game" element={<Game />} />
              {/* <Route path="/Leaderboard" element={<Leaderboard />} /> */}
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
