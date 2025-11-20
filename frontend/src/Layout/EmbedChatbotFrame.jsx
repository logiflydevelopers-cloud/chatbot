// src/Layout/EmbedChatbotFrame.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function EmbedChatbotFrame() {
  // Isolated layout
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";
    document.body.style.background = "transparent";
    document.documentElement.style.background = "transparent";
  }, []);

  const url = window.location.href;
  const userId = url.split("/").pop();
  const apiBase = "https://demo-chatbot-backend.vercel.app/";

  const chatRef = useRef();
  const [show, setShow] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // SETTINGS (dynamic)
  const [primaryColor, setPrimaryColor] = useState("#2563eb");
  const [avatar, setAvatar] = useState("/bot1.png");
  const [firstMessage, setFirstMessage] = useState("Hi 👋 How can I help you today?");
  const [alignment, setAlignment] = useState("right");

  // Fetch settings from correct endpoint and auto-refresh
  const loadSettings = async () => {
    try {
      const res = await axios.get(`${apiBase}/api/chatbot/${userId}`);
      if (res.data.success && res.data.settings) {
        const s = res.data.settings;
        setPrimaryColor(s.primaryColor || "#2563eb");
        setAvatar(s.avatar || "/bot1.png");
        setFirstMessage(s.firstMessage || "Hi 👋 How can I help you today?");
        setAlignment(s.alignment || "right");
      } else {
        // no settings found; try localStorage fallback (if embed script otherwise running locally)
        const uploaded = localStorage.getItem("uploadedWebsite");
        // nothing to do with uploaded here; just keep defaults
      }
    } catch (err) {
      console.log("Error fetching settings:", err.message);
    }
  };

  useEffect(() => {
    loadSettings();
    const i = setInterval(loadSettings, 3000); // live update every 3s
    return () => clearInterval(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // initial bot message
  useEffect(() => {
    setMessages([{ from: "bot", text: firstMessage }]);
  }, [firstMessage]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { from: "user", text: input }]);
    const question = input;
    setInput("");

    try {
      const res = await axios.post(`${apiBase}/api/chat`, { userId, question });
      setMessages(prev => [...prev, { from: "bot", text: res.data.answer || "Sorry, I couldn't find an answer." }]);
    } catch (err) {
      setMessages(prev => [...prev, { from: "bot", text: "⚠️ Error connecting to AI." }]);
    }
  };

  const handleKey = (e) => e.key === "Enter" && sendMessage();

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "fixed", inset: 0, background: "transparent" }}>
      {!show && <button onClick={() => setShow(true)} style={{ position: "fixed", bottom: 20, [alignment]: 20, zIndex: 999999, backgroundColor: primaryColor, width: 60, height: 60, borderRadius: "50%", border: "none", color: "#fff", fontSize: 26, cursor: "pointer" }}>💬</button>}

      {show && (
        <div style={{ position: "fixed", bottom: 20, [alignment]: 20, height: 520, background: "#fff", borderRadius: 12, boxShadow: "0 4px 15px rgba(0,0,0,0.25)", zIndex: 999999, display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: "sans-serif" }}>
          <div style={{ background: primaryColor, color: "#fff", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img src={avatar} style={{ width: 36, height: 36, borderRadius: "50%" }} alt="bot" />
              <b>AI Chatbot</b>
            </div>
            <button onClick={() => setShow(false)} style={{ background: "transparent", border: "none", color: "#fff", fontSize: 20, cursor: "pointer" }}>✖</button>
          </div>

          <div ref={chatRef} style={{ flex: 1, padding: 12, overflowY: "auto", background: "#f8fafc" }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
                {m.from === "bot" && <img src={avatar} style={{ width: 28, height: 28, marginRight: 8, borderRadius: "50%" }} alt="bot" />}
                <div style={{ background: m.from === "user" ? primaryColor : "#e2e8f0", color: m.from === "user" ? "#fff" : "#111", padding: "8px 12px", borderRadius: m.from === "user" ? "14px 14px 2px 14px" : "14px 14px 14px 2px", maxWidth: "75%" }}>{m.text}</div>
              </div>
            ))}
          </div>

          <div style={{ padding: 10, borderTop: "1px solid #d1d5db", display: "flex" }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey} placeholder="Type your message..." style={{ flex: 1, borderRadius: 8, border: "1px solid #ccc", padding: "10px" }} />
            <button onClick={sendMessage} style={{ marginLeft: 10, background: primaryColor, color: "#fff", border: "none", padding: "10px 18px", borderRadius: 8, cursor: "pointer" }}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
