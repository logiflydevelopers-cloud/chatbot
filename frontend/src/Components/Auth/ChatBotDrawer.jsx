import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./ChatBotDrawer.css";
import sendIcon from "../../image/Group 427320708.svg";

export default function ChatBotDrawer({
  userId,
  apiBase,
  primaryColor,
  avatar,
  firstMessage,
  alignment = "right",
  showChat,
  showBubble,
  onClose,
  onBubbleClick,
  isEmbed = false,
}) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [questions, setQuestions] = useState([]);

  const chatRef = useRef(null);

  /* =================================================
      LOAD WELCOME MESSAGE (ONLY ONCE / UPDATE)
  ================================================= */
  useEffect(() => {
    if (!showChat) return;

    setMessages((prev) => {
      if (prev.length === 0) {
        return [{ from: "bot", text: firstMessage }];
      }

      if (prev[0].from === "bot") {
        const updated = [...prev];
        updated[0] = { ...updated[0], text: firstMessage };
        return updated;
      }

      return prev;
    });
  }, [showChat, firstMessage]);

  /* =================================================
      LOAD QUESTIONS (CHIPS)
  ================================================= */
  useEffect(() => {
    if (!showChat) return;

    const loadQuestions = async () => {
      try {
        const res = await axios.get(`${apiBase}/api/qa/user/${userId}`);
        setQuestions(res.data || []);
      } catch {
        console.log("QA load failed");
      }
    };

    loadQuestions();
  }, [showChat, apiBase, userId]);

  /* =================================================
      AUTO SCROLL
  ================================================= */
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  /* =================================================
      SEND MESSAGE
  ================================================= */
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;
    setInput("");

    // add user msg + typing placeholder
    setMessages((prev) => [
      ...prev,
      { from: "user", text: userText },
      { from: "bot", typing: true },
    ]);

    try {
      const res = await axios.post(`${apiBase}/api/chatbot/chat`, {
        userId,
        question: userText,
      });

      const answer = res.data?.answer || "No response";

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { from: "bot", text: answer };
        return updated;
      });
    } catch (error) {
      console.error("Chat error:", error);

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          from: "bot",
          text: "⚠️ Server error. Please try again later.",
        };
        return updated;
      });
    }
  };

  return (
    <>
      {/* ================= CHAT WINDOW ================= */}
      {showChat && (
        <div
          className="chatbot-drawer"
          style={{
            [alignment]: isEmbed ? 0 : 25,
            bottom: isEmbed ? 0 : 25,
            background: primaryColor,
            boxShadow: isEmbed ? "none" : "0 4px 8px #00000030",
          }}
        >
          {/* HEADER */}
          <div className="chatbot-header" style={{ background: primaryColor }}>
            <div className="chatbot-title">
              <img src={avatar} alt="avatar" />
              <b>AI Chatbot</b>
            </div>
            <button onClick={onClose}>✖</button>
          </div>

          {/* BODY */}
          <div className="chatbot-body" ref={chatRef}>
            {messages.map((m, i) => (
              <React.Fragment key={i}>
                <div className={`chat-row ${m.from}`}>
                  {m.from === "bot" && (
                    <img
                      src={avatar}
                      alt="bot"
                      className="bot-avatar"
                      style={{ borderColor: primaryColor }}
                    />
                  )}

                  <div
                    className="chat-bubble"
                    style={{
                      background:
                        m.from === "user" ? primaryColor : "#e5e7eb",
                      color: m.from === "user" ? "#fff" : "#111",
                      borderRadius:
                        m.from === "user"
                          ? "14px 14px 0 14px"
                          : "0 14px 14px 14px",
                    }}
                  >
                    {m.typing ? (
                      <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    ) : (
                      <ReactMarkdown>{m.text}</ReactMarkdown>
                    )}
                  </div>
                </div>

                {/* QUESTION CHIPS (ONLY BELOW FIRST BOT MSG) */}
                {i === 0 && questions.length > 0 && (
                  <div
                    className="question-chips"
                    style={{
                      display: "flex",
                      gap: 6,
                      marginLeft: "auto",
                      marginRight: 40,
                      marginTop: 6,
                      maxWidth: "75%",
                      flexWrap: "wrap",
                      justifyContent: "flex-end",
                    }}
                  >
                    {questions.map((qa, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setMessages((prev) => [
                            ...prev,
                            { from: "user", text: qa.question },
                            { from: "bot", text: qa.answer },
                          ]);
                          setQuestions((prev) =>
                            prev.filter((q) => q.question !== qa.question)
                          );
                        }}
                        style={{
                          background: primaryColor,
                          color: "#fff",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: 999,
                          fontSize: 13,
                          cursor: "pointer",
                        }}
                      >
                        {qa.question}
                      </button>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* INPUT */}
          <div className="chatbot-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type here..."
            />
            <button onClick={sendMessage} style={{ background: primaryColor }}>
              <img src={sendIcon} alt="send" />
            </button>
          </div>
        </div>
      )}

      {/* ================= FLOATING BUBBLE ================= */}
      {showBubble && (
        <div
          className="chatbot-bubble"
          style={{
            [alignment]: 20,
            border: `3px solid ${primaryColor}`,
          }}
          onClick={onBubbleClick}
        >
          <img src={avatar} alt="bubble" />
        </div>
      )}
    </>
  );
}
