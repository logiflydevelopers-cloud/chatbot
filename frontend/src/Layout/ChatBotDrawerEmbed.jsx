// src/Components/Auth/ChatBotDrawerEmbed.jsx
import React from "react";
import { useParams } from "react-router-dom";
import ChatBotDrawer from "../Components/Auth/ChatBotDrawer";


export default function ChatBotDrawerEmbed() {
  const { userId } = useParams();

  return (
    <ChatBotDrawer
      userId={userId}
      apiBase={window.CHATBOT_API_BASE || "http://localhost:4000"}
      alignment={window.CHATBOT_ALIGNMENT || "right"}
      onClose={() => {}}   // embed ma close disable
    />
  );
}
