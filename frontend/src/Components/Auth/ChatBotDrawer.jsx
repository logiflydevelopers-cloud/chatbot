import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./ChatBotDrawer.css";
import sendIcon from "../../image/Group 427320708.svg";

/* 🔒 SYSTEM MESSAGE */
const SYSTEM_LEAD_MESSAGE =
  "Good afternoon and welcome to LiveChat. To assist you better, could you please provide your name and email address?";

/* EMAIL VALIDATOR */
const isEmail = (text) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);

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
  const [leadSaved, setLeadSaved] = useState(false);
  const [labelUsed] = useState(false);



  const chatRef = useRef(null);
  const initialized = useRef(false);

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
    if (!showChat || initialized.current) return;
    initialized.current = true;

    const welcomeText =
      firstMessage || "Hi there 👋 I'm your assistant!";

    // STEP 1: typing welcome
    setConversation([{ from: "bot", typing: true }]);

    setTimeout(() => {
      typeText(
        welcomeText,
        (typedWelcome) => {
          setConversation([{ from: "bot", text: typedWelcome }]);
        },
        () => {
          // STEP 2: show labels AFTER welcome
          setWelcomeDone(true);

          // STEP 3: show system AFTER labels (small delay)
          setTimeout(() => {


            setConversation((prev) => [
              ...prev,
              { from: "system", typing: true },
            ]);

            typeText(
              SYSTEM_LEAD_MESSAGE,
              (typedSystem) => {
                setConversation((prev) => [
                  prev[0],
                  { from: "system", text: typedSystem },
                ]);
              }
            );
          }, 600);
        }
      );
    }, 400);
  }, [showChat, firstMessage]);


  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [conversation]);

  /* ================= LABEL CLICK ================= */
  const handleLabelClick = (item) => {
    // USER QUESTION (RIGHT)
    setConversation((prev) => [
      ...prev,
      {
        from: "user",
        text: item.question || item.label,
      },
    ]);

    // BOT ANSWER (LEFT)
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
      if (!leadSaved && isEmail(userText)) {
        const res = await axios.post(
          `${apiBase}/api/chatbot/register-lead`,
          { userId, email: userText }
        );
        const name = res.data?.name || userText.split("@")[0];
        setLeadSaved(true);

        setTimeout(() => {
          setConversation((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              from: "bot",
              text: `Thank you, ${name || "there"}! How can we assist you today?`,
              animated: true,
            };
            return updated;
          });
        }, 500);
        return;
      }

      const res = await axios.post(`${apiBase}/api/chatbot/chat`, {
        userId,
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

          <div className="chatbot-body" ref={chatRef}>
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
            {welcomeDone && !labelUsed && labels.length > 0 && (
              <div className="chatbot-labels">
                {labels.map((item, i) => (
                  <button
                    key={i}
                    className="label-chip"
                    onClick={() => handleLabelClick(item)}
                    style={{ border: `2px solid ${primaryColor}` }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}



            {/* SYSTEM MESSAGE (ANCHOR) */}
            {/* <div className="chat-row system">
              <img src={avatar} alt="bot" style={{ border: `2px solid ${primaryColor}` }} className="bot-avatar" />
              <div className="chat-bubble system">
                {SYSTEM_LEAD_MESSAGE}
              </div>
            </div> */}

            {/* CONVERSATION AFTER SYSTEM MESSAGE */}
            {conversation.slice(1).map((m, i) => (
              <div key={i} className={`chat-row ${m.from}`} >
                {(m.from === "bot" || m.from === "system") && (
                  <img src={avatar} alt="bot" className="bot-avatar" />
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
