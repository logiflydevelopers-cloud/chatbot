import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./TeachAgent.css";
import BotAvatar from "../../../image/Ellipse 90.png";
import aiIcon from "../../../image/ai.svg";
import { FiArrowLeft } from "react-icons/fi";
import { useOutletContext } from "react-router-dom";
import "../AIPersona.css";

const TeachAgent = ({ user }) => {
  const apiBase = "https://chatbot-backend-project.vercel.app/teach-agent";

  // 🔹 Freeze username (NO warning, NO rerender)
  const userNameRef = useRef(
    user?.name || "User"
  );


  const buildFirstMessage = (name) =>
    ` Good evening, ${name}! 😊 It’s truly a pleasure to connect with you—imagine us sharing a cozy cup of tea as we chat. Feel free to share what’s on your mind today!`;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [isTypewriting, setIsTypewriting] = useState(false);

  const bottomRef = useRef(null);
  const hasInitialized = useRef(false);
  const { setSidebarOpen } = useOutletContext();

  // 🔹 Typewriter (single render)
  const typeWriterEffect = (text) => {
    setIsTypewriting(true);
    setTypingText("");
    let index = 0;

    const interval = setInterval(() => {
      setTypingText((prev) => prev + text.charAt(index));
      index++;

      if (index === text.length) {
        clearInterval(interval);
        setMessages((prev) => [...prev, { sender: "bot", text }]);
        setTypingText("");
        setIsTypewriting(false);
      }
    }, 35);
  };

  // 🔹 First greeting (ONCE)
  useEffect(() => {
  if (hasInitialized.current) return;
  hasInitialized.current = true;

  const msg = buildFirstMessage(userNameRef.current);

  setThinking(true);
  setTimeout(() => {
    setThinking(false);
    typeWriterEffect(msg);
  }, 1200);
}, []);


  // 🔹 Auto scroll chat ONLY
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingText]);

  // 🔹 Send message
  const sendMessage = async () => {
    if (!input.trim() || thinking || isTypewriting) return;

    const userMsg = input.trim();
    setInput("");

    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setThinking(true);

    try {
      const res = await axios.post(`${apiBase}/chat`, {
        question: userMsg,
      });

      const botReply = res.data.answer || "No reply";

      setTimeout(() => {
        setThinking(false);
        typeWriterEffect(botReply);
      }, 1000);
    } catch (err) {
      setThinking(false);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠ API Error" },
      ]);
    }
  };

  // 🔹 Restart chat
  const restartChat = async () => {
    await axios.post(`${apiBase}/restart`);

    setMessages([]);
    setTypingText("");
    setThinking(true);

    const msg = buildFirstMessage(userNameRef.current);

    setTimeout(() => {
      setThinking(false);
      typeWriterEffect(msg);
    }, 1200);
  };

  return (
    <div className="teach-chat-container">
      {/* HEADER */}
      <div className="teach-header">
        <div className="persona-header">
          <button className="back-btn" onClick={() => setSidebarOpen(true)}>
            <FiArrowLeft />
          </button>

          <div className="persona-icon">
            <img src={aiIcon} alt="AI" />
          </div>

          <div>
            <h2>TEACH YOUR AGENT</h2>
            <p>Prepare your Agent by simply talking</p>
          </div>
        </div>

        <button className="header-btn" onClick={restartChat}>
          ↺ Restart
        </button>
      </div>

      <hr className="divider" />

      {/* CHAT + INPUT WRAPPER */}
      <div className="chat-wrapper">
        {/* CHAT */}
        <div className="chat-area">
          {messages.map((m, i) => (
            <div key={i} className="chat-row">
              {m.sender === "bot" && (
                <img src={BotAvatar} className="msg-avatar" alt="bot" />
              )}
              <div
                className={`msg-bubble ${m.sender === "user" ? "user-msg" : "bot-msg"
                  }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {/* TYPEWRITER */}
          {isTypewriting && (
            <div className="chat-row">
              <img src={BotAvatar} className="msg-avatar" alt="bot" />
              <div className="msg-bubble bot-msg">{typingText}</div>
            </div>
          )}

          {/* THINKING */}
          {thinking && (
            <div className="chat-row">
              <img src={BotAvatar} className="msg-avatar" alt="bot" />
              <div className="typing-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* INPUT FIXED */}
        <div className="input-area">
          <input
            className="chat-input"
            value={input}
            placeholder="Type here"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button className="send-mic-btn" onClick={sendMessage}>
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeachAgent;
