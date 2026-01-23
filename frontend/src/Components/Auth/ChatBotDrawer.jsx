import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./ChatBotDrawer.css";
import sendIcon from "../../image/Group 427320708.svg";


/* TYPEWRITER */
const typeText = (text, onUpdate, onDone) => {
  let index = 0;
  let current = "";
  const interval = setInterval(() => {
    current += text[index];
    index++;
    onUpdate(current);
    if (index >= text.length) {
      clearInterval(interval);
      onDone && onDone();
    }
  }, 30);
};

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
  const [welcomeDone, setWelcomeDone] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [labels, setLabels] = useState([]);


  const [showLeadForm, setShowLeadForm] = useState(true);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [leadId, setLeadId] = useState(null);







  const chatRef = useRef(null);
  // const initialized = useRef(false);

  /* ================= LOAD LABELS ================= */
  useEffect(() => {
    if (!userId) return;
    axios
      .get(`${apiBase}/api/qa/labels/${userId}`)
      .then((res) => setLabels(res.data || []))
      .catch(() => setLabels([]));
  }, [userId, apiBase]);

  /* ================= WELCOME MESSAGE ================= */
useEffect(() => {
  if (!showChat) return;

  const welcomeText = firstMessage || "Hi there 👋 I'm your assistant!";

  setConversation([]);
  setWelcomeDone(false);

  setTimeout(() => {
    typeText(
      welcomeText,
      (typed) => {
        setConversation([{ from: "bot", text: typed }]);
      },
      () => {
        setWelcomeDone(true);
      }
    );
  }, 200);

}, [showChat, firstMessage]);






  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [conversation]);

  /* ================= LABEL CLICK ================= */
  const handleLabelClick = (item) => {

    // 🔒 BLOCK UNTIL START CHAT
    if (showLeadForm) return;

    setConversation((prev) => [
      ...prev,
      {
        from: "user",
        text: item.question || item.label,
      },
    ]);

    setTimeout(() => {
      setConversation((prev) => [
        ...prev,
        {
          from: "bot",
          text: item.answer,
          animated: true,
        },
      ]);
    }, 400);
  };


  useEffect(() => {
    const storedLeadId = localStorage.getItem("chatbot_leadId");

    if (storedLeadId) {
      setLeadId(storedLeadId);
      setShowLeadForm(false); // 👈 skip lead form
    }
  }, []);





  /* ================= USER INPUT ================= */
  const sendMessage = async () => {
    if (!input.trim()) return;
    const userText = input;
    setInput("");

    setConversation((prev) => [
      ...prev,
      { from: "user", text: userText },
      { from: "bot", typing: true },
    ]);

    try {
      const res = await axios.post(`${apiBase}/api/chatbot/chat`, {
        userId,
        leadId,
        question: userText,
      });

      setTimeout(() => {
        setConversation((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            from: "bot",
            text: res.data?.answer || "No response",
            animated: true,
          };
          return updated;
        });
      }, 600);
    } catch {
      setConversation((prev) => {
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
      {showChat && (
        <div
          className="chatbot-drawer"
          style={{
            [alignment]: isEmbed ? 0 : 25,
            bottom: isEmbed ? 0 : 25,
            background: primaryColor,
          }}
        >
          <div className="chatbot-header">
            <div className="chatbot-title">
              <img src={avatar} alt="avatar" />
              <b>AI Chatbot</b>
            </div>
            <button onClick={onClose}>✖</button>
          </div>

          <div
            className={`chatbot-body ${showLeadForm ? "lead-mode" : "chat-mode"}`}
            ref={chatRef}
          >

            {/* WELCOME */}
            {conversation.slice(0, 1).map((m, i) => (
              <div key={i} className={`chat-row ${m.from}`}>
                <img src={avatar} style={{ border: `2px solid ${primaryColor}` }} alt="bot" className="bot-avatar" />
                <div className="chat-bubble bot" >
                  <ReactMarkdown>{m.text}</ReactMarkdown>
                </div>
              </div>
            ))}

            {/* LABELS */}
            {welcomeDone && labels.length > 0 && (
              <div className="chatbot-labels">
                {labels.map((item, i) => (
                  <button
                    className={`label-chip ${showLeadForm ? "disabled" : ""}`}
                    onClick={() => handleLabelClick(item)}
                    style={{
                      border: `2px solid ${primaryColor}`,
                      opacity: showLeadForm ? 0.5 : 1,
                      cursor: showLeadForm ? "not-allowed" : "pointer"
                    }}
                  >
                    {item.label}
                  </button>

                ))}
              </div>
            )}

            {welcomeDone && showLeadForm && userId && (
              <div className="chat-row bot">
                {/* LEFT AVATAR */}
                <img
                  src={avatar}
                  alt="bot"
                  className="bot-avatar"
                  style={{ border: `2px solid ${primaryColor}` }}
                />

                {/* FORM AS CHAT BUBBLE */}
                <div className="lead-chat-bubble">
                  <p className="lead-title">
                    Let's chat! Fill in a few details to get started.
                  </p>

                  <input
                    type="text"
                    placeholder="Name"
                    value={leadName}
                    onChange={(e) => {
                      setLeadName(e.target.value);
                      setNameError("");
                    }}
                  />
                  {nameError && <div className="form-error">{nameError}</div>}


                  <input
                    type="email"
                    placeholder="Email"
                    value={leadEmail}
                    onChange={(e) => {
                      setLeadEmail(e.target.value);
                      setEmailError("");
                    }}
                  />
                  {emailError && <div className="form-error">{emailError}</div>}


                  <button
                    style={{ background: primaryColor }}
                    onClick={async () => {
                      let hasError = false;

                      if (!leadName.trim()) {
                        setNameError("Name is required");
                        hasError = true;
                      }

                      if (!leadEmail.trim()) {
                        setEmailError("Email is required");
                        hasError = true;
                      }

                      if (hasError) return;

                      try {
                        const res = await axios.post(
                          `${apiBase}/api/chatbot/register-lead`,
                          {
                            userId,
                            name: leadName,
                            email: leadEmail
                          }
                        );

                        const leadIdFromApi = res.data.chatUserId;

                        // ✅ SAVE IN STATE
                        setLeadId(leadIdFromApi);

                        // ✅ SAVE IN LOCALSTORAGE
                        localStorage.setItem("chatbot_leadId", leadIdFromApi);

                        setShowLeadForm(false);

                        setConversation((prev) => [
                          ...prev,
                          {
                            from: "bot",
                            text: `Thanks ${res.data.name}! How can I help you today?`,
                            animated: true
                          }
                        ]);

                      } catch (err) {
                        console.error("Lead register error", err);
                      }
                    }}
                  >
                    Start the chat
                  </button>



                </div>
              </div>
            )}



            {/* CONVERSATION AFTER SYSTEM MESSAGE */}
            {conversation.slice(1).map((m, i) => (
              <div key={i} className={`chat-row ${m.from}`} >
                {(m.from === "bot" || m.from === "system") && (
                  <img src={avatar} style={{ border: `2px solid ${primaryColor}` }} alt="bot" className="bot-avatar" />
                )}
                <div className={`chat-bubble ${m.from}`}
                  style={{
                    background: m.from === "user" ? primaryColor : "#f3f4f6",
                    color: m.from === "user" ? "#fff" : "#111",
                  }}
                >
                  {m.typing ? (
                    <span className="typing-dots">
                      <span></span><span></span><span></span>
                    </span>
                  ) : (
                    <ReactMarkdown>{m.text}</ReactMarkdown>
                  )}
                </div>
              </div>
            ))}
          </div>

          {!showLeadForm && (
            <div className="chatbot-input">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type here..."
              />
              <button onClick={sendMessage} style={{ background: primaryColor }}>
                <img src={sendIcon} alt="send" />
              </button>
            </div>
          )}
        </div>
      )}

      {showBubble && (
        <div
          className="chatbot-bubble"
          onClick={onBubbleClick}
          style={{
            border: `3px solid ${primaryColor}`,
            [alignment]: isEmbed ? 10 : 25,
            bottom: isEmbed ? 10 : 25,
          }}
        >
          <img src={avatar} alt="bubble" />
        </div>
      )}
    </>
  );
}
