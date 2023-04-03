import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { ThemeProvider } from "./contexts";
import {ParallaxProvider } from "react-scroll-parallax";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ParallaxProvider>
          <App />
        </ParallaxProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
