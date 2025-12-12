import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./TeachAgent.css";
import BotAvatar from "../../../image/Ellipse 90.png";

const TeachAgent = () => {
  const apiBase = "http://localhost:4000/teach-agent";

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const bottomRef = useRef(null);

  const firstMessage =
    "Good evening, Logifly Developers! 😊 It’s truly a pleasure to connect with you—imagine us sharing a cozy cup of tea as we chat. Feel free to share what’s on your mind today!";

  // First bot message
  useEffect(() => {
    setMessages([{ sender: "bot", text: firstMessage }]);
  }, []);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // SEND MESSAGE
  const sendMessage = async () => {
    if (!input.trim()) return;

    const msg = input.trim();
    setInput("");

    setMessages((prev) => [...prev, { sender: "user", text: msg }]);
    setTyping(true);

    try {
      const res = await axios.post(`${apiBase}/chat`, {
        question: msg,
      });

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: res.data.answer || "No reply" },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠ API Error" },
      ]);
    }

    setTyping(false);
  };

  // Restart Chat
  const restartChat = async () => {
    try {
      await axios.post(`${apiBase}/restart`);
      setMessages([{ sender: "bot", text: firstMessage }]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="teach-chat-container">

      {/* HEADER */}
      <div className="teach-header">
        <div className="teach-header-left">

          {/* Purple icon box */}
          <div className="kb-icon-box purple">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="#fff"
              viewBox="0 0 24 24"
            >
              <path d="M12 3C7.03 3 3 6.58 3 11c0 2.23 1.02 4.26 2.73 5.79-.08.78-.37 1.98-1.39 3.05-.21.22-.02.58.27.53 1.52-.27 3.04-.83 4.16-1.34 1 .31 2.09.47 3.23.47 4.97 0 9-3.58 9-8s-4.03-8-9-8zm-3 9c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm3 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm3 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
            </svg>
          </div>

          <div>
            <h2 className="teach-title">Teach Your Agent</h2>
            <p className="teach-subtitle">Prepare your Agent by simply talking</p>
          </div>
        </div>

        <div className="header-buttons">
          <button className="header-btn" onClick={restartChat}>↺ Restart</button>
        </div>
      </div>

      <hr className="divider" />

      {/* CHAT AREA */}
      <div className="chat-area">
        {messages.map((m, i) => (
          <div key={i} className="chat-row">
            {m.sender === "bot" && (
              <img src={BotAvatar} className="msg-avatar" alt="bot" />
            )}

            <div className={`msg-bubble ${m.sender === "user" ? "user-msg" : "bot-msg"}`}>
              {m.text}
            </div>
          </div>
        ))}

        {typing && (
          <div className="typing-dots">
            <span>.</span><span>.</span><span>.</span>
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      {/* INPUT */}
      <div className="input-area">
        <input
          className="chat-input"
          value={input}
          placeholder="Type here"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="send-mic-btn" onClick={sendMessage}>➤</button>
      </div>
    </div>
  );
};

export default TeachAgent;
