import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./TeachAgent.css";

import Ellipse90 from "../image/Ellipse90.png";
import Ellipse91 from "../image/Ellipse91.png";
import Ellipse92 from "../image/Ellipse92.png";
import Ellipse93 from "../image/Ellipse93.png";

const TeachAgentChat = ({ user }) => {
  const apiBase = "https://backend-demo-chatbot.vercel.app";

  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");

  const [avatar, setAvatar] = useState(Ellipse90);
  const [primaryColor, setPrimaryColor] = useState("#2563eb");
  const [firstMessage, setFirstMessage] = useState(
    "Hi there 👋 I'm your assistant!"
  );

  const bottomRef = useRef(null);

  const mapAvatar = (name) => {
    switch (name) {
      case "Ellipse91": return Ellipse91;
      case "Ellipse92": return Ellipse92;
      case "Ellipse93": return Ellipse93;
      default: return Ellipse90;
    }
  };

  // Load Chatbot Drawer Settings
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${apiBase}/api/chatbot/${user?._id}`);

        if (res.data.success && res.data.settings) {
          const s = res.data.settings;

          setAvatar(mapAvatar(s.avatar));
          setPrimaryColor(s.primaryColor);
          setFirstMessage(s.firstMessage);
        }
      } catch (e) {}

      // LOCAL STORAGE FALLBACK
      const stored = localStorage.getItem("chatbot_settings");
      if (stored) {
        const s = JSON.parse(stored);
        setAvatar(mapAvatar(s.avatar));
        setPrimaryColor(s.primaryColor);
        setFirstMessage(s.firstMessage);
      }
    };

    load();
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
    const msg = input.trim();

    setMessages((prev) => [...prev, { sender: "user", text: msg }]);
    setInput("");
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
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠ Something went wrong." },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="ta-container">

      {/* HEADER SAME AS CHATBOTDRAWER */}
      <div className="ta-header" style={{ background: primaryColor }}>
        <img src={avatar} className="ta-header-avatar" alt="bot" />
        <span>Your AI Agent</span>
      </div>

      {/* BODY */}
      <div className="ta-body">

        {messages.map((m, i) => (
          <div
            key={i}
            className={`ta-msg-row ${m.sender === "user" ? "right" : "left"}`}
          >
            {m.sender === "bot" && (
              <img src={avatar} className="ta-msg-avatar" alt="bot" />
            )}

            <div
              className={`ta-msg ${m.sender}`}
              style={{
                background: m.sender === "user" ? primaryColor : "#e2e8f0",
                color: m.sender === "user" ? "#fff" : "#000",
              }}
            >
              {m.text}
            </div>
          </div>
        ))}

        {typing && (
          <div className="ta-typing">
            <span className="ta-dot"></span>
            <span className="ta-dot"></span>
            <span className="ta-dot"></span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="ta-input-box">
        <input
          value={input}
          placeholder="Type your question..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} style={{ background: primaryColor }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default TeachAgentChat;
