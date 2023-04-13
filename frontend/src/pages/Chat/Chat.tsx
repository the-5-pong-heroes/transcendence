import React from "react";

import "./Chat.css";

interface ChatProps {
  chatRef: React.RefObject<HTMLDivElement>;
}

export const Chat: React.FC<ChatProps> = ({ chatRef }) => {
  return (
    <div ref={chatRef} id="Chat" className="chat">
      <h1 className="chat-title">Chat</h1>
    </div>
  );
};
