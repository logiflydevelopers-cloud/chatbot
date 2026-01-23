import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import "./TeachAgent.css";
import "../train-page.css";
import BotAvatar from "../../../image/Ellipse 90.png";
import aiIcon from "../../../image/TEACH YOUR AGENT.svg";
import { FiArrowLeft } from "react-icons/fi";
import { useOutletContext, useNavigate } from "react-router-dom";

const TeachAgent = ({ user }) => {
  const apiBase = "http://localhost:4000";
  const userId = user?.id || user?._id;

  const { setSidebarOpen } = useOutletContext();
  const navigate = useNavigate();

  /* ======================
     REFS
  ====================== */
  const typingIntervalRef = useRef(null);
  const bottomRef = useRef(null);
  const userNameRef = useRef("User");

  /* ======================
     STATES
  ====================== */
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [isTypewriting, setIsTypewriting] = useState(false);

  /* LEAD STATES */
  const [showLeadForm, setShowLeadForm] = useState(true);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadId, setLeadId] = useState(null);

  const [checkingWebsite, setCheckingWebsite] = useState(true);

  /* ======================
     WEBSITE CHECK
  ====================== */
  useEffect(() => {
    const checkWebsite = async () => {
      try {
        const res = await axios.get(`${apiBase}/api/chatbot/${userId}`);
        const site = res.data?.settings?.website;

        if (!site) {
          alert("❌ Please upload a website first");
          navigate("/dashboard/knowledge");
          return;
        }
      } catch (err) {
        console.error(err);
      } finally {
        setCheckingWebsite(false);
      }
    };

    if (userId) checkWebsite();
  }, [userId, navigate]);

  /* ======================
     CLEANUP
  ====================== */
  useEffect(() => {
    return () => clearInterval(typingIntervalRef.current);
  }, []);

  /* ======================
     TYPEWRITER
  ====================== */
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

  /* ======================
     GREETING (MUST BE ABOVE useEffect)
  ====================== */
  const startGreeting = useCallback(
    (name) => {
      const msg = `Hi ${name} 👋 I'm your assistant!`;
      setThinking(true);

      setTimeout(() => {
        setThinking(false);
        typeWriterEffect(msg, () => {
          setMessages([{ sender: "bot", text: msg }]);
        });
      }, 400);
    },
    [] // safe
  );

  /* ======================
     LOAD LEAD FROM LOCAL
  ====================== */
  useEffect(() => {
    const storedLeadId = localStorage.getItem("teachAgentLeadId");
    const storedLeadName = localStorage.getItem("teachAgentLeadName");

    if (storedLeadId && storedLeadName) {
      setLeadId(storedLeadId);
      userNameRef.current = storedLeadName;
      setShowLeadForm(false);
      startGreeting(storedLeadName);
    }
  }, [startGreeting]);

  /* ======================
     AUTO SCROLL
  ====================== */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingText]);

  /* ======================
     SEND MESSAGE
  ====================== */
  const sendMessage = async () => {
    if (!input.trim() || thinking || isTypewriting) return;

    const userMsg = input.trim();
    setInput("");

    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setThinking(true);

    try {
      const res = await axios.post(`${apiBase}/api/chatbot/chat`, {
        userId,
        leadId,
        question: userMsg,
      });

      const botReply = res.data?.answer || "No reply";

      setTimeout(() => {
        setThinking(false);
        typeWriterEffect(botReply, () => {
          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: botReply },
          ]);
        });
      }, 400);
    } catch {
      setThinking(false);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠ API Error" },
      ]);
    }
  };

  if (checkingWebsite) {
    return <div className="loader-center">Checking setup...</div>;
  }

  /* ======================
     RENDER
  ====================== */
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
      </div>

      {/* CHAT */}
      <div className="chat-wrapper">
        <div className="chat-area">

          {/* LEAD FORM */}
          {showLeadForm && (
            <div className="chat-row">
              <img src={BotAvatar} className="msg-avatar" alt="bot" />

              <div className="lead-chat-bubble">
                <p>Let's chat! Fill in a few details to get started.</p>

                <input
                  placeholder="Name"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                />

                <input
                  placeholder="Email"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                />

                <button
                  className="lead-start-btn"
                  onClick={async () => {
                    if (!leadName || !leadEmail) return;

                    const res = await axios.post(
                      `${apiBase}/api/chatbot/register-lead`,
                      {
                        userId,
                        name: leadName,
                        email: leadEmail,
                      }
                    );

                    const id = res.data.chatUserId;

                    localStorage.setItem("teachAgentLeadId", id);
                    localStorage.setItem(
                      "teachAgentLeadName",
                      leadName
                    );

                    setLeadId(id);
                    userNameRef.current = leadName;
                    setShowLeadForm(false);
                    startGreeting(leadName);
                  }}
                >
                  Start the chat
                </button>
              </div>
            </div>
          )}

          {/* MESSAGES */}
          {!showLeadForm &&
            messages.map((m, i) => (
              <div key={i} className="chat-row">
                {m.sender === "bot" && (
                  <img src={BotAvatar} className="msg-avatar" alt="bot" />
                )}
                <div className={`msg-bubble ${m.sender}-msg`}>
                  {m.text}
                </div>
              </div>
            ))}

          {isTypewriting && (
            <div className="chat-row">
              <img src={BotAvatar} className="msg-avatar" alt="bot" />
              <div className="msg-bubble bot-msg">{typingText}</div>
            </div>
          )}

          {thinking && (
            <div className="chat-row">
              <img src={BotAvatar} className="msg-avatar" alt="bot" />
              <div className="typing-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        {!showLeadForm && (
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
        )}
      </div>
    </div>
  );
};

export default TeachAgent;
