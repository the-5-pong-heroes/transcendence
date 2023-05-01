import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ParallaxProvider } from "react-scroll-parallax";

import { AppProvider } from "./contexts";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <ParallaxProvider scrollAxis="horizontal">
          {/* <ParallaxProvider scrollAxis="horizontal" isDisabled> */}
          <App />
        </ParallaxProvider>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
