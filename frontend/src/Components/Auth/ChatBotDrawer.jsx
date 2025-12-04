import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function ChatBotDrawer({
  userId,
  apiBase = "http://localhost:4000",
  primaryColor: defaultColor = "#2563eb",
  avatar: defaultAvatar = "/avatars/avatar1.png",
  firstMessage: defaultMsg = "Hi there 👋 How can I help you?",
  alignment: defaultAlign = "right",
  onClose = () => {},
}) {
  const [primaryColor, setPrimaryColor] = useState(defaultColor);
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [firstMessage, setFirstMessage] = useState(defaultMsg);
  const [alignment, setAlignment] = useState(defaultAlign);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const chatRef = useRef(null);

  /* ------------------------------------------------------
      1️⃣ LOAD SETTINGS FROM BACKEND (Embed + Customize)
  -------------------------------------------------------*/
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await axios.get(`${apiBase}/api/chatbot/${userId}`);

        if (res.data.success && res.data.settings) {
          const s = res.data.settings;
          setPrimaryColor(s.primaryColor || defaultColor);
          setAvatar(s.avatar || defaultAvatar);
          setFirstMessage(s.firstMessage || defaultMsg);
          setAlignment(s.alignment || defaultAlign);
        }
      } catch {
        console.log("Settings load failed → using localStorage fallback");
      }

      // Local fallback
      const stored = localStorage.getItem("chatbot_settings");
      if (stored) {
        const s = JSON.parse(stored);
        setPrimaryColor(s.primaryColor || defaultColor);
        setAvatar(s.avatar || defaultAvatar);
        setFirstMessage(s.firstMessage || defaultMsg);
        setAlignment(s.alignment || defaultAlign);
      }
    };

    loadSettings();
  }, [userId]);

  /* ------------------------------------------------------
      2️⃣ SHOW FIRST MESSAGE
  -------------------------------------------------------*/
  useEffect(() => {
    setMessages([{ from: "bot", text: firstMessage }]);
  }, [firstMessage]);

  /* ------------------------------------------------------
      3️⃣ LOAD Q&A Suggestions
  -------------------------------------------------------*/
  useEffect(() => {
    const loadQA = async () => {
      try {
        const res = await axios.get(`${apiBase}/api/qa/user/${userId}`);
        setSuggestions(res.data || []);
      } catch (err) {
        console.log("Error loading Q&A:", err);
      }
    };
    loadQA();
  }, [userId]);

  /* ------------------------------------------------------
      4️⃣ AUTO SCROLL
  -------------------------------------------------------*/
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  /* ------------------------------------------------------
      5️⃣ SEND MESSAGE
  -------------------------------------------------------*/
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;
    setInput("");

    setMessages((prev) => [...prev, { from: "user", text: userText }]);

    try {
      const res = await axios.post(
        `${apiBase}/api/chatbot/chat`,
        { userId, question: userText },
        { withCredentials: true }
      );

      const botReply =
        res.data?.answer || "🤖 Sorry, I don't have an answer right now.";

      setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Server error. Please try later." },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  /* ------------------------------------------------------
      6️⃣ CHAT UI (Same for Embed & Customize)
  -------------------------------------------------------*/
  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        [alignment]: 20,
        width: 370,
        height: 540,
        borderRadius: 16,
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 8px 25px rgba(0,0,0,0.18)",
        overflow: "hidden",
        zIndex: 99999,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 16px",
          background: primaryColor,
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img
            src={avatar}
            alt="chatbot-avatar"
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              border: "2px solid #fff",
            }}
          />
          <b>AI Chatbot</b>
        </div>

        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          ✖
        </button>
      </div>

      {/* Quick Replies */}
      <div
        style={{
          padding: 10,
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          background: "#fff",
          borderBottom: "1px solid #eee",
          maxHeight: 90,
          overflowY: "auto",
        }}
      >
        {suggestions.length === 0 && (
          <p style={{ fontSize: 12, color: "#777" }}>No Q&A added yet</p>
        )}

        {suggestions.map((qa, index) => (
          <button
            key={index}
            onClick={() =>
              setMessages((prev) => [
                ...prev,
                { from: "user", text: qa.question },
                { from: "bot", text: qa.answer },
              ])
            }
            style={{
              background: primaryColor,
              color: "#fff",
              border: "none",
              padding: "6px 12px",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            {qa.question}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div
        ref={chatRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 12,
          background: "#f8fafc",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              margin: "10px 0",
              display: "flex",
              justifyContent: m.from === "user" ? "flex-end" : "flex-start",
            }}
          >
            {m.from === "bot" && (
              <img
                src={avatar}
                alt="bot-avatar"
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
                background: m.from === "user" ? primaryColor : "#e2e8f0",
                color: m.from === "user" ? "#fff" : "#111",
                padding: "10px 14px",
                borderRadius:
                  m.from === "user"
                    ? "14px 14px 2px 14px"
                    : "14px 14px 14px 2px",
                maxWidth: "75%",
                fontSize: 14,
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div
        style={{
          padding: 8,
          borderTop: "1px solid #ddd",
          display: "flex",
          background: "#fff",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type message..."
          style={{
            flex: 1,
            padding: 10,
            border: "1px solid #ccc",
            borderRadius: 8,
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            marginLeft: 8,
            background: primaryColor,
            color: "#fff",
            border: "none",
            padding: "0 16px",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
