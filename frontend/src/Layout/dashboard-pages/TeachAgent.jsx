import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./TeachAgentChat.css";

// ⭐ IMPORT SAME AVATARS
import Ellipse90 from "../image/Ellipse 90.png";
import Ellipse91 from "../image/Ellipse 91.png";
import Ellipse92 from "../image/Ellipse 92.png";
import Ellipse93 from "../image/Ellipse 93.png";

const TeachAgentChat = ({ user }) => {
  const apiBase = "https://backend-demo-chatbot.vercel.app";

  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");

  const [avatar, setAvatar] = useState(Ellipse90);
  const [primaryColor, setPrimaryColor] = useState("#2563eb");
  const [firstMessage, setFirstMessage] = useState("Hi there 👋 I'm your assistant!");

  const bottomRef = useRef(null);

  const mapAvatar = (name) => {
    switch (name) {
      case "Ellipse91": return Ellipse91;
      case "Ellipse92": return Ellipse92;
      case "Ellipse93": return Ellipse93;
      default: return Ellipse90;
    }
  };

  // Load saved settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await axios.get(`${apiBase}/api/chatbot/${user?._id}`);
        if (res.data.success && res.data.settings) {
          const s = res.data.settings;
          setAvatar(mapAvatar(s.avatar));
          setPrimaryColor(s.primaryColor || "#2563eb");
          setFirstMessage(s.firstMessage || firstMessage);
        }
      } catch {}

      const stored = localStorage.getItem("chatbot_settings");
      if (stored) {
        const s = JSON.parse(stored);
        setAvatar(mapAvatar(s.avatar));
        setPrimaryColor(s.primaryColor || "#2563eb");
        setFirstMessage(s.firstMessage || firstMessage);
      }
    };

    loadSettings();
  }, [user]);

  // First message
  useEffect(() => {
    setMessages([{ sender: "bot", text: firstMessage }]);
  }, [firstMessage]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const msg = input;
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: msg }]);
    setTyping(true);

    try {
      const res = await axios.post(`${apiBase}/api/chatbot/chat`, {
        userId: user?._id,
        question: msg,
      });

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: res.data.answer || "Sorry, I don't know." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠ Something went wrong!" },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="teach-chat-container">

      {/* HEADER */}
      <div className="teach-header" style={{ background: primaryColor }}>
        <img src={avatar} className="teach-header-avatar" alt="avatar" />
        <b>Your AI Agent</b>
      </div>

      {/* CHAT BODY */}
      <div className="teach-body">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`teach-msg-row ${msg.sender === "user" ? "right" : "left"}`}
          >
            {msg.sender === "bot" && (
              <img src={avatar} className="teach-msg-avatar" alt="bot" />
            )}

            <div
              className={`teach-msg ${msg.sender}`}
              style={{
                background: msg.sender === "user" ? primaryColor : "#e2e8f0",
                color: msg.sender === "user" ? "#fff" : "#000",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {typing && (
          <div className="teach-typing">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="teach-input-box">
        <input
          type="text"
          value={input}
          placeholder="Type your question..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          style={{ background: primaryColor }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default TeachAgentChat;
