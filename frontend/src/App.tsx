<<<<<<< HEAD
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AppLayout, NotFoundLayout } from "./components";
import { Login, SignUp, Home, Profile, Game, Leaderboard, Chat, NotFound } from "./pages";
import type { AppContextParameters, PageRefs } from "./@types";
import { useAppContext, useUser } from "./hooks";
import "./App.css";

const App: React.FC = () => {
  const { theme, pageRefs }: AppContextParameters = useAppContext();
  const { homeRef, profileRef, gameRef, boardRef, chatRef, notFoundRef }: PageRefs = pageRefs;
  const { user, isLoading } = useUser();

  if (isLoading) {
    // Show loading state while user data is being fetched
    return (
      <div className="loading-app">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="App" id={theme}>
      <Routes>
        <Route path="/Login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/SignUp" element={user ? <Navigate to="/" /> : <SignUp />} />
        <Route element={<NotFoundLayout />}>
          <Route path="*" element={<NotFound notFoundRef={notFoundRef} />} />
        </Route>
        <Route element={<AppLayout user={user} />}>
          <Route path="/" element={<Home homeRef={homeRef} />} />
          <Route path="/Profile" element={<Profile profileRef={profileRef} />} />
          <Route path="/Game" element={<Game gameRef={gameRef} />} />
          <Route path="/Leaderboard" element={<Leaderboard boardRef={boardRef} />} />
          <Route path="/Chat" element={<Chat chatRef={chatRef} />} />
        </Route>
      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        rtl={false}
        theme="colored"
      />
    </div>
=======
import React, { useContext } from "react";
import { Route, Routes, useParams } from "react-router-dom";

import { Navbar, ThemeButton, Container } from "./components";
import { Home, Profile, Game, Leaderboard, Settings, Chat, Login, Signup, NotFound } from "./pages";
import "./App.css";
import { SocketProvider, AppContext } from "./contexts";

const App: React.FC = () => {
  const appContext = useContext(AppContext);
  if (appContext === undefined) {
    throw new Error("Undefined AppContext");
  }
  const { theme, homeRef, myProfileRef, profileRef, settingsRef, gameRef, boardRef, chatRef, logRef, signupRef } = appContext;

  return (
    <SocketProvider>
      <div className="App" id={theme}>
        <Navbar />
        <ThemeButton />
        <div className="App-container">
          <Container>
            <Routes>
              <Route path="/" element={<Home homeRef={homeRef} />} />
              <Route path="/Profile" element={<Profile key="my-profile" profileRef={myProfileRef} />} />
              <Route path="/Profile/:uuid" element={<Profile key={useParams().uuid} profileRef={profileRef} />} />
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
>>>>>>> master
  );
};

export default App;
