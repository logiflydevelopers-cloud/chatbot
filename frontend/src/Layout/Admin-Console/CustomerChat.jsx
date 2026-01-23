import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import BotAvatar from "../../image/Ellipse 90.png";
import { FiArrowLeft } from "react-icons/fi";
import "./CustomerChat.css";

const CustomerChat = () => {
  const { userId, id } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  const bottomRef = useRef(null);
  const apiBase = "http://localhost:4000";

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await axios.get(`${apiBase}/api/admin/chats`, {
          params: { userId, leadId: id },
        });

        setMessages(res.data.messages || []);

        const cust = await axios.get(
          `${apiBase}/api/admin/customers/${userId}`
        );
        setCustomer(cust.data.find(c => c.leadId === id));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
  }, [userId, id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) return <p className="state-text">Loading chat...</p>;

  return (
    <div className="admin-chat-page">
      <div className="admin-chat-container">

        {/* 📱 MOBILE HEADER */}
        <div className="admin-chat-mobile-header">
          <button
            className="chat-back-btn"
            onClick={() => navigate(`/admin/customers/${userId}`)}
          >
            <FiArrowLeft />
          </button>
          <div>
            <h2>{customer?.name || "Customer"}</h2>
            <p>{customer?.email || ""}</p>
          </div>
        </div>

        {/* 🖥️ DESKTOP HEADER */}
        <div className="admin-chat-header">
          <h2>{customer?.name || "Customer"}</h2>
          <p>{customer?.email || ""}</p>
        </div>

        {/* CHAT */}
        <div className="admin-chat-area">
          {messages.map((m, i) => (
            <div key={i} className="chat-row">
              {m.role === "assistant" && (
                <img src={BotAvatar} className="msg-avatar" alt="bot" />
              )}
              <div
                className={`msg-bubble ${
                  m.role === "assistant" ? "bot-msg" : "user-msg"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
};

export default CustomerChat;
