import React, { useState, useEffect, useRef } from "react";
import { useCallback } from "react";
import axios from "axios";
import "./TeachAgent.css";
import BotAvatar from "../../../image/Ellipse 90.png";
import aiIcon from "../../../image/TEACH YOUR AGENT.svg";
import { FiArrowLeft } from "react-icons/fi";
import { useOutletContext } from "react-router-dom";



const TeachAgent = ({ user }) => {
  const apiBase = "http://localhost:4000";

  /* ===============================
      REFS
  =============================== */
  const userNameRef = useRef(user?.name || "User");
  const greetedRef = useRef(false);
  const typingIntervalRef = useRef(null);

  const bottomRef = useRef(null);
  const { setSidebarOpen } = useOutletContext();

  /* ===============================
      STATE
  =============================== */
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [isTypewriting, setIsTypewriting] = useState(false);

  /* ===============================
      HELPERS
  =============================== */
  const buildFirstMessage = (name) =>
    `Good evening, ${name}! 😊 It’s truly a pleasure to connect with you—imagine us sharing a cozy cup of tea as we chat. Feel free to share what’s on your mind today!`;


  /* ===============================
      TYPEWRITER (DISPLAY ONLY)
  =============================== */
  const typeWriterEffect = (text, onDone) => {
    clearInterval(typingIntervalRef.current);

    setIsTypewriting(true);
    setTypingText("");

    let index = 0;

    typingIntervalRef.current = setInterval(() => {
      index++;
      setTypingText(text.slice(0, index));

      if (index >= text.length) {
        clearInterval(typingIntervalRef.current);
        setIsTypewriting(false);
        setTypingText("");
        onDone?.();
      }
    }, 30);
  };

  /* ===============================
      START FRESH GREETING
  =============================== */
  const startFreshGreeting = useCallback(() => {
    const msg = buildFirstMessage(userNameRef.current);

    setThinking(true);

    setTimeout(() => {
      setThinking(false);
      typeWriterEffect(msg, () => {
        setMessages([{ sender: "bot", text: msg }]);
      });
    }, 600);
  }, []);


  /* ===============================
      FIRST LOAD GREETING
  =============================== */
  useEffect(() => {
    if (greetedRef.current) return;

    greetedRef.current = true;
    startFreshGreeting();
  }, [startFreshGreeting]);


  /* ===============================
      AUTO SCROLL
  =============================== */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingText]);

  /* ===============================
      SEND MESSAGE
  =============================== */
  const sendMessage = async () => {
    if (!input.trim() || thinking || isTypewriting) return;

    const userMsg = input.trim();
    setInput("");

    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setThinking(true);

    try {
      const res = await axios.post(
        `${apiBase}/api/chatbot/chat`,   // ✅ SAME AS ChatBotDrawer
        {
          userId: user?.id || user?._id, // ✅ FIXED
          question: userMsg,
        }
      );

      const botReply = res.data.answer || "No reply";

      setTimeout(() => {
        setThinking(false);
        typeWriterEffect(botReply, () => {
          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: botReply },
          ]);
        });
      }, 600);
    } catch (err) {
      console.error(err);
      setThinking(false);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠ API Error" },
      ]);
    }
  };


  /* ===============================
      RESTART CHAT (FRESH)
  =============================== */
  const restartChat = () => {
    clearInterval(typingIntervalRef.current);

    setMessages([]);
    setTypingText("");
    setIsTypewriting(false);
    setThinking(false);

    startFreshGreeting();
  };


  /* ===============================
      RENDER
  =============================== */
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

      {/* CHAT */}
      <div className="chat-wrapper">
        <div className="chat-area">
          {messages.map((m, i) => (
            <div key={i} className="chat-row">
              {m.sender === "bot" && (
                <img src={BotAvatar} className="msg-avatar" alt="bot" />
              )}
              <div className={`msg-bubble ${m.sender}-msg`}>
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

          {/* THINKING DOTS */}
          {thinking && (
            <div className="chat-row">
              <img src={BotAvatar} className="msg-avatar" alt="bot" />
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
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
          <button className="send-mic-btn" onClick={sendMessage}>
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeachAgent;
