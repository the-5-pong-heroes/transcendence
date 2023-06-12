import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ParallaxProvider } from "react-scroll-parallax";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClient, QueryClientProvider } from "react-query";
// import { ReactQueryDevtools } from "react-query/devtools";

import { AppProvider } from "./contexts";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary fallback={<div className="error-fallback">Something went wrong</div>}>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AppProvider>
            <ParallaxProvider scrollAxis="horizontal">
              <App />
              {/* <ReactQueryDevtools /> */}
            </ParallaxProvider>
          </AppProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
