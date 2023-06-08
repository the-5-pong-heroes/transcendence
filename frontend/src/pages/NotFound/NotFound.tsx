import React from "react";
import "./NotFound.css";

import { WallEPlayingPong } from "@assets";

interface NotFoundProps {
  notFoundRef: React.RefObject<HTMLDivElement>;
}

export const NotFound: React.FC<NotFoundProps> = ({ notFoundRef }) => {
  return (
    <div ref={notFoundRef} className="notFound">
      <div className="notFound-text">Sorry, page not found...</div>
      <video autoPlay loop muted id="video">
        <source src={WallEPlayingPong} type="video/mp4" />
      </video>
    </div>
  );
};
