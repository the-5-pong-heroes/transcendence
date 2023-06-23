import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate, useParams, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AppLayout, NotFoundLayout, LoadingPage } from "./components";
import { Login, Home, Profile, Game, Settings, Leaderboard, Chat, NotFound } from "./pages";
import type { AppContextParameters, PageRefs } from "./@types";
import { useAppContext, useUserQuery } from "./hooks";
import "./App.css";

const useNavigationRoute = (): void => {
  const { isNavigatingRef }: AppContextParameters = useAppContext();

  const location = useLocation();
  const [currentLoc, setCurrentLoc] = useState<string>("/");

  useEffect(() => {
    // execute on location change
    setCurrentLoc(location.pathname);
    isNavigatingRef.current = true;
    setTimeout(() => (isNavigatingRef.current = false), 2000);
  }, [location, currentLoc, isNavigatingRef]);
};

const App: React.FC = () => {
  const [goTo, setGoTo] = useState<string>("");

  const { theme, pageRefs }: AppContextParameters = useAppContext();
  const { homeRef, profileRef, myProfileRef, settingsRef, gameRef, boardRef, chatRef, notFoundRef }: PageRefs =
    pageRefs;
  const { user, isLoading } = useUserQuery();
  const { uuid } = useParams();

  useNavigationRoute();

  if (isLoading) {
    // Show loading page while user data is being fetched
    return <LoadingPage />;
  }

  return (
    <div className="App" id={theme}>
      <Routes>
        <Route path="/Login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route element={<NotFoundLayout />}>
          {/* <Route path="*" element={<NotFound notFoundRef={notFoundRef} />} /> */}
          <Route path="/404" element={<NotFound notFoundRef={notFoundRef} />} />
          <Route path="*" element={<UnkownRouteHandler to="/404" />} />
        </Route>
        <Route element={<AppLayout user={user} goTo={goTo} setGoTo={setGoTo} />}>
          <Route path="/" element={<Home homeRef={homeRef} setGoTo={setGoTo} />} />
          <Route path="/Profile" element={<Profile key="my-profile" profileRef={myProfileRef} setGoTo={setGoTo} />}>
            <Route path=":uuid" element={<Profile key={uuid} profileRef={profileRef} setGoTo={setGoTo} />} />
          </Route>
          <Route path="/Settings/" element={<Settings settingsRef={settingsRef} setGoTo={setGoTo} />} />
          <Route path="/Game" element={<Game gameRef={gameRef} setGoTo={setGoTo} />} />
          <Route path="/Leaderboard" element={<Leaderboard boardRef={boardRef} setGoTo={setGoTo} />} />
          <Route path="/Chat" element={<Chat chatRef={chatRef} setGoTo={setGoTo} />} />
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
  );
};

export default App;

interface UnknownRouteProps {
  to: string;
}

const UnkownRouteHandler: React.FC<UnknownRouteProps> = ({ to }) => {
  const prevRoute = useLocation();

  return <Navigate to={to} state={{ prevRoute }} replace />;
};
