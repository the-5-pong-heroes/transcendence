import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AppLayout, NotFoundLayout } from "./components";
import { Login, SignUp, Home, Profile, Game, Leaderboard, Chat, NotFound } from "./pages";
import type { AppContextParameters, PageRefs } from "./@types";
import { useAppContext, useUser, useLocalStorageChange } from "./hooks";
import "./App.css";

const App: React.FC = () => {
  const { theme, pageRefs }: AppContextParameters = useAppContext();
  const { homeRef, profileRef, gameRef, boardRef, chatRef, notFoundRef }: PageRefs = pageRefs;
  const { userAuth } = useUser();
  useLocalStorageChange();

  return (
    <div className="App" id={theme}>
      <Routes>
        <Route path="/Login" element={userAuth ? <Navigate to="/" /> : <Login />} />
        <Route path="/SignUp" element={userAuth ? <Navigate to="/" /> : <SignUp />} />
        <Route element={<NotFoundLayout />}>
          <Route path="*" element={<NotFound notFoundRef={notFoundRef} />} />
        </Route>
        <Route element={<AppLayout userAuth={userAuth} />}>
          <Route path="/" element={<Home homeRef={homeRef} />} />
          <Route path="/Profile" element={<Profile profileRef={profileRef} />} />
          <Route path="/Game" element={<Game gameRef={gameRef} />} />
          <Route path="/Leaderboard" element={<Leaderboard boardRef={boardRef} />} />
          <Route path="/Chat" element={<Chat chatRef={chatRef} />} />
        </Route>
      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default App;
