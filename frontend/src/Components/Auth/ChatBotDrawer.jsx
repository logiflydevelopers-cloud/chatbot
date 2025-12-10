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
  isCustomizerMode = false,
}) {
  const [primaryColor, setPrimaryColor] = useState(defaultColor);
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [firstMessage, setFirstMessage] = useState(defaultMsg);
  const [alignment, setAlignment] = useState(defaultAlign);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const chatRef = useRef(null);

  /* LOAD SETTINGS */
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
      } catch (error) {
        console.log("Settings load failed");
      }

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
  }, [apiBase, userId, defaultColor, defaultAvatar, defaultMsg, defaultAlign]);

  /* FIRST MESSAGE */
  useEffect(() => {
    setMessages([{ from: "bot", text: firstMessage }]);
  }, [firstMessage]);

  /* LOAD QA */
  useEffect(() => {
    axios
      .get(`${apiBase}/api/qa/user/${userId}`)
      .then((res) => setSuggestions(res.data || []))
      .catch(() => {});
  }, [apiBase, userId]);

  /* AUTO SCROLL */
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  /* SEND MESSAGE */
  const sendMessage = async () => {
    if (!input.trim()) return;

    const text = input;
    setInput("");

    setMessages((prev) => [...prev, { from: "user", text }]);

    try {
      const res = await axios.post(`${apiBase}/api/chatbot/chat`, {
        userId,
        question: text,
      });

      setMessages((prev) => [
        ...prev,
        { from: "bot", text: res.data.answer || "Sorry, I don't know." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Server error. Try later." },
      ]);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        [alignment]: 0,
        width: 330,
        height: 460,
        borderRadius: 16,
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 8px 25px rgba(0,0,0,0.18)",
        overflow: "hidden",
        zIndex: 99999,
      }}
    >
      {/* HEADER */}
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
            alt="chatbot avatar"
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
          aria-label="close chatbot"
        >
          ✖
        </button>
      </div>

      {/* QUICK SUGGESTIONS */}
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
        {suggestions.length === 0 ? (
          <p style={{ fontSize: 12, color: "#777" }}>No suggestions</p>
        ) : (
          suggestions.map((qa, index) => (
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
          ))
        )}
      </div>

      {/* MESSAGES */}
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
                alt="bot avatar"
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
                borderRadius: 14,
                maxWidth: "75%",
                fontSize: 14,
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* INPUT */}
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
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
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
