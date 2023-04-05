import React, { useContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import { Navbar, ThemeButton, Container } from "./components";
import { Home, Profile, Game, Leaderboard, Chat, NotFound } from "./pages";
import "./App.css";
import { SocketProvider, ThemeContext } from "@/contexts";

// const ScrollTo = () => {
//   const { pathname } = useLocation();

//   useEffect(() => {
//     // window.scrollTo(200, 200);
//     const element = document.getElementById(pathname);
//     if (element) {
//       console.log(pathname);
//       element.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [pathname]);

//   return null;
// }

const Pages: React.FC = () => {
  return (
    <Container>
      <Home/>
      <Leaderboard/>
      <Chat/>
      <Profile/>
    </Container>
  );
}

const App: React.FC = () => {
  const themeContext = useContext(ThemeContext);
  if (themeContext === undefined) {
    throw new Error("Undefined ThemeContext");
  }
  const { theme, scrollRef } = themeContext;

  useEffect(() => {
    console.log("**", scrollRef.current);
    const element = document.getElementById(scrollRef.current);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, [scrollRef]);

  return (
    <SocketProvider>
      <div className="App" id={theme}>
        <Navbar />
        <ThemeButton />
        <Container>
          <div className="PageContainer">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Profile" element={<Profile />} />
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
