import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TeachAgent.css";

const TeachAgent = () => {
  const [chatbotConfig, setChatbotConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch customized chatbot if exists
  useEffect(() => {
    const userId = localStorage.getItem("userId"); // or JWT decode

    axios
      .get(`http://localhost:4000/api/chatbot/custom/${userId}`)
      .then((res) => {
        if (res.data && res.data.chatbot) {
          setChatbotConfig(res.data.chatbot); // Customized chatbot loaded
        } else {
          setChatbotConfig(null); // default chatbot
        }
        setLoading(false);
      })
      .catch(() => {
        setChatbotConfig(null);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="teach-wrapper">

      {/* PAGE HEADER */}
      <div className="teach-header">
        <div className="teach-header-icon">💬</div>
        <div>
          <h2 className="teach-title">Teach Your Agent</h2>
          <p className="teach-subtitle">Prepare your Agent by simply talking</p>
        </div>

        <div className="teach-tools">
          <button className="teach-btn">⟳ Restart</button>
          <button className="teach-btn">📅 Chat History</button>
        </div>
      </div>

      {/* CHATBOX */}
      <div className="teach-chatbox">
        {/* If customized chatbot exists */}
        {chatbotConfig ? (
          <iframe
            className="custom-chatbot-frame"
            title="Custom Chatbot"
            src={chatbotConfig.embedUrl}
          ></iframe>
        ) : (
          /* Default chatbot */
          <iframe
            className="custom-chatbot-frame"
            title="Default Chatbot"
            src="https://default-bot.myserver.com/chat"
          ></iframe>
        )}
      </div>

      {/* USER INPUT */}
      <div className="teach-input-area">
        <input type="text" placeholder="Type here" className="teach-input" />
        <button className="teach-send-btn">🎤</button>
      </div>
    </div>
  );
};

export default TeachAgent;
