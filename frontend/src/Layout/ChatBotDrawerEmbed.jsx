import React from "react";
import { useParams } from "react-router-dom";
import ChatBotDrawer from "../Components/Auth/ChatBotDrawer";

export default function ChatBotDrawerEmbed() {
  const { userId } = useParams();

  /* =========================================
      🔥 HASH ROUTER SAFE PARAM PARSING
  ========================================= */
  const href = window.location.href;

  const getParam = (key) => {
    try {
      const queryString = href.split("?")[1];
      if (!queryString) return null;
      return new URLSearchParams(queryString).get(key);
    } catch {
      return null;
    }
  };

  const avatar = getParam("avatar");
  const primaryColor = getParam("color");
  const firstMessage = getParam("msg");

  return (
    <ChatBotDrawer
      userId={userId}
      apiBase={window.CHATBOT_API_BASE || "http://localhost:4000"}
      alignment={window.CHATBOT_ALIGNMENT || "right"}
      avatar={avatar}
      primaryColor={primaryColor}
      firstMessage={firstMessage}
      showChat={true}
      showBubble={false}
      isEmbed={true}
      onClose={() => {
        window.parent.postMessage("CLOSE_CHATBOT", "*");
      }}
    />
  );
}
