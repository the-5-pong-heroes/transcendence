import React from "react";
import "./Loader.css";
import "./LoaderOldPong.scss";

interface LoaderParameters {
  loader: boolean;
}

// const OldPongLoader: React.FC = () => (
//   <div>
//     <div className="wrapper">
//       <div className="main">
//         <div className="inner">
//           <div className="screen">
//             <div className="pong">loading...</div>
//           </div>
//         </div>
//         <div className="side"></div>
//       </div>
//     </div>
//     <div className="shade"></div>
//   </div>
// );

export const Loader: React.FC<LoaderParameters> = ({ loader }) => {
  if (!loader) {
    return null;
  }

  return (
    <div className="modal-loader">
      <div className="loader-wrapper">
        <div className="loader"></div>
        <div className="text">
          Waiting for player
          <span className="jumping-dots">
            <span className="dot-1">.</span>
            <span className="dot-2">.</span>
            <span className="dot-3">.</span>
          </span>
        </div>
      </div>
    </div>
  );
};
