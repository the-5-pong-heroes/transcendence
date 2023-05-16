import React from "react";

import { ClientEvents } from "@Game/@types";
import type { SocketContextParameters, InvitationState } from "@types";
import { useSocketContext, useAppContext } from "@hooks";

import "./Invitation.css";

export const InvitationModal: React.FC = () => {
  const { invitation, setInvitation, senderSocket, senderName }: InvitationState = useAppContext().invitationState;
  const { socketRef }: SocketContextParameters = useSocketContext();

  const sendResponse = (response: boolean): void => {
    socketRef.current?.emit(ClientEvents.GameInviteResponse, { response: response, senderId: senderSocket.current });
    setInvitation(false);
  };

  if (!invitation) {
    return null;
  }

  return (
    <div className="invitation">
      <div className="game-modal">
        <div className="quit-text">
          <div>You received an invitation to play from {senderName.current} !</div>
          <div>Do you accept it ?</div>
        </div>
        <div className="game-button-wrapper">
          <button className="game-button" onClick={() => sendResponse(true)}>
            ACCEPT
          </button>
          <button className="game-button" onClick={() => sendResponse(false)}>
            DECLINE
          </button>
        </div>
      </div>
    </div>
  );
};
