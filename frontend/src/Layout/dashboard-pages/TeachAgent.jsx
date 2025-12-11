import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

// ⭐ IMPORT SAME AVATARS AS DRAWER
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

  // ⭐ MAP DB avatar string → actual imported image
  const mapAvatar = (key) => {
    switch (key) {
      case "Ellipse91": return Ellipse91;
      case "Ellipse92": return Ellipse92;
      case "Ellipse93": return Ellipse93;
      default: return Ellipse90;
    }
  };

  // ⭐ Load settings from DB + LocalStorage (same as Drawer)
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await axios.get(`${apiBase}/api/chatbot/${user?._id}`);
        if (res.data.success && res.data.settings) {
          const s = res.data.settings;

          setAvatar(mapAvatar(s.avatar));
          setPrimaryColor(s.primaryColor || "#2563eb");
          setFirstMessage(s.firstMessage || "Hi there 👋 I'm your assistant!");
        }
      } catch (e) {}

      // LocalStorage fallback
      const stored = localStorage.getItem("chatbot_settings");
      if (stored) {
        const s = JSON.parse(stored);

        setAvatar(mapAvatar(s.avatar));
        setPrimaryColor(s.primaryColor || "#2563eb");
        setFirstMessage(s.firstMessage || "Hi there 👋 I'm your assistant!");
      }
    };

    loadSettings();
  }, [user]);

  // ⭐ Initial welcome message (same as drawer)
  useEffect(() => {
    setMessages([{ sender: "bot", text: firstMessage }]);
  }, [firstMessage]);

  // ⭐ Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ⭐ Send message (same API as drawer)
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
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Something went wrong!" },
      ]);
    } finally {
      setTyping(false);
    }
  };

  // ⭐ Typing animation CSS (same as drawer)
  const typingStyle = `
    @keyframes typingBounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-5px); }
    }
    .typing-dot {
      width: 8px;
      height: 8px;
      background: #475569;
      border-radius: 50%;
      animation: typingBounce 1s infinite;
      margin-right: 4px;
      display: inline-block;
    }
    .typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .typing-dot:nth-child(3) { animation-delay: 0.4s; }
  `;

  return (
    <div style={{ width: "100%", maxWidth: 700, margin: "0 auto" }}>
      <style>{typingStyle}</style>

      {/* HEADER (Same as Drawer) */}
      <div
        style={{
          background: primaryColor,
          padding: "16px",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderRadius: 10,
        }}
      >
        <img
          src={avatar}
          alt="avatar"
          style={{
            width: 45,
            height: 45,
            borderRadius: "50%",
            border: "2px solid white",
          }}
        />
        <b style={{ fontSize: 18 }}>Your AI Agent</b>
      </div>

      {/* CHAT BODY */}
      <div
        style={{
          background: "#f8fafc",
          padding: 16,
          height: 500,
          overflowY: "auto",
          borderRadius: 10,
          marginTop: 10,
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              marginBottom: 12,
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
            }}
          >
            {msg.sender === "bot" && (
              <img
                src={avatar}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  marginRight: 8,
                }}
              />
            )}

            <div
              style={{
                background: msg.sender === "user" ? primaryColor : "#e2e8f0",
                color: msg.sender === "user" ? "#fff" : "#000",
                padding: "10px 14px",
                borderRadius: 12,
                maxWidth: "70%",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {typing && (
          <div
            style={{
              background: "#e2e8f0",
              padding: "10px 14px",
              borderRadius: 12,
              display: "inline-block",
            }}
          >
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT BOX */}
      <div
        style={{
          display: "flex",
          marginTop: 10,
          gap: 10,
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your question..."
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 10,
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            background: primaryColor,
            color: "#fff",
            border: "none",
            padding: "0 20px",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default TeachAgentChat;
