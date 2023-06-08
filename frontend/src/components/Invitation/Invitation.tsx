import React from "react";

import { ClientEvents } from "@Game/@types";
import type { InvitationState } from "@types";
import { useSocket, useAppContext } from "@hooks";
import { GameButton } from "@Game/GameOverlay/components";

import "./Invitation.css";

export const InvitationModal: React.FC = () => {
  const { invitation, setInvitation, senderSocket, senderName }: InvitationState = useAppContext().invitationState;
  const socket = useSocket();

  const sendResponse = (response: boolean): void => {
    socket.emit(ClientEvents.GameInviteResponse, { response: response, senderId: senderSocket.current });
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
        <div className="game-button-wrapper-text">
          <GameButton text="ACCEPT" onClick={() => sendResponse(true)} />
          <GameButton text="DECLINE" onClick={() => sendResponse(false)} />
        </div>
      </div>
    </div>
  );
};
