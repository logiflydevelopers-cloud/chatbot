import React, { useState, useEffect } from "react";
import axios from "axios";
import ChatBotDrawer from "../Components/Auth/ChatBotDrawer";
import { useParams, useNavigate } from "react-router-dom";

const CustomChatPage = ({ user }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const apiBase = "http://localhost:4000";

  const [avatar, setAvatar] = useState("/avatars/avatar1.png");
  const [firstMessage, setFirstMessage] = useState("Hi there 👋 I'm your assistant!");
  const [primaryColor, setPrimaryColor] = useState("#2563eb");
  const [alignment, setAlignment] = useState("right");
  const [selectedWebsite, setSelectedWebsite] = useState(null);

  const [showChat, setShowChat] = useState(true);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    const hasPDF = localStorage.getItem("hasPDF");
    const hasQA = localStorage.getItem("hasQA");
    const uploaded = localStorage.getItem("uploadedWebsite");

    if (!hasPDF && !hasQA && !uploaded) {
      alert("⚠️ Please upload FILE, WEBSITE, or Q&A first.");
      navigate("/dashboard/knowledge");
    }
  }, [navigate]);

  /* ==========================================================
        ⭐ LOAD ALL CUSTOMIZATION + WEBSITE (correct priority)
        Priority:
        1. DB (Strong Source)
        2. LocalStorage chatbot_settings
        3. uploadedWebsite fallback
  =========================================================== */
  useEffect(() => {
    const fetchSettings = async () => {
      let websiteDB = null;

      try {
        const res = await axios.get(`${apiBase}/api/chatbot/${userId}`);

        if (res.data.success && res.data.settings) {
          const s = res.data.settings;
          if (s.avatar) setAvatar(s.avatar);
          if (s.firstMessage) setFirstMessage(s.firstMessage);
          if (s.primaryColor) setPrimaryColor(s.primaryColor);
          if (s.alignment) setAlignment(s.alignment);

          websiteDB = s.website || null;
        }
      } catch (error) {
        console.warn("DB load error →", error.message);
      }

      let websiteLS = null;
      const ls = localStorage.getItem("chatbot_settings");
      if (ls) {
        const s = JSON.parse(ls);
        websiteLS = s.website || null;
      }

      const uploaded = localStorage.getItem("uploadedWebsite") || null;

      // FINAL priority
      setSelectedWebsite(websiteDB || websiteLS || uploaded || null);
    };

    fetchSettings();
  }, [userId]);

  /* ==========================================================
        ⭐ SAVE CUSTOMIZATION
  =========================================================== */
  const saveCustomization = async () => {
    try {
      const payload = {
        userId,
        avatar,
        firstMessage,
        primaryColor,
        alignment,
        website: selectedWebsite || null,
      };

      const res = await axios.post(`${apiBase}/api/chatbot/save`, payload);

      if (res.data.success) {
        alert("Customization Saved Successfully!");
        localStorage.setItem("chatbot_settings", JSON.stringify(payload));
      } else {
        alert("Save failed");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Save failed");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%", overflow: "hidden" }}>
      {/* SAVE BUTTON */}
      <div
        style={{
          position: "fixed",
          top: "100px",
          width: "100%",
          padding: "10px 20px",
          zIndex: 1000,
        }}
      >
        <button
          onClick={saveCustomization}
          style={{
            background: "#facc15",
            color: "#000",
            border: "none",
            borderRadius: 6,
            padding: "6px 16px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          💾 Save
        </button>
      </div>

      {/* LEFT SETTINGS */}
      <div
        style={{
          width: "300px",
          background: "#f3f4f6",
          padding: "20px",
          borderRight: "1px solid #d1d5db",
          height: "100vh",
          overflowY: "auto",
          marginTop: "50px",
        }}
      >
        <h3>Customize</h3>

        <label>Choose Avatar</label>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
          {[
            "/avatars/avatar1.png",
            "/avatars/avatar2.png",
            "/avatars/avatar3.png",
            "/avatars/avatar4.png",
            "/avatars/avatar5.png",
          ].map((img) => (
            <img
              key={img}
              src={img}
              alt="avatar"
              onClick={() => setAvatar(img)}
              style={{
                width: 55,
                height: 55,
                borderRadius: "50%",
                border: avatar === img ? "3px solid #2563eb" : "2px solid #ccc",
                padding: "3px",
                cursor: "pointer",
              }}
            />
          ))}
        </div>

        <label>Chat Theme Color</label>
        <input
          type="color"
          value={primaryColor}
          onChange={(e) => setPrimaryColor(e.target.value)}
          style={{ width: "100%", height: "40px", marginBottom: 15 }}
        />

        <label>Welcome Message</label>
        <textarea
          value={firstMessage}
          onChange={(e) => setFirstMessage(e.target.value)}
          rows={3}
          style={{
            width: "100%",
            borderRadius: 6,
            padding: 10,
            border: "1px solid #ccc",
            marginBottom: 15,
          }}
        />

        <label>Chat Position</label>
        <select
          value={alignment}
          onChange={(e) => setAlignment(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        >
          <option value="right">Right</option>
          <option value="left">Left</option>
        </select>

        {/* SHOW ONLY IF WEBSITE EXISTS */}
        {selectedWebsite ? (
          <div style={{ marginTop: 18 }}>
            <label style={{ fontWeight: 500 }}>Selected Website</label>
            <input
              type="text"
              readOnly
              value={selectedWebsite}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 6,
                border: "1px solid #ccc",
                marginTop: 6,
              }}
            />
          </div>
        ) : (
          <p style={{ marginTop: 18, color: "red", fontWeight: 600 }}>
            ⚠️ No website selected
          </p>
        )}
      </div>

      {/* CHAT PREVIEW */}
      <div style={{ flex: 1, position: "relative", marginTop: "50px" }}>
        {showChat && (
          <ChatBotDrawer
            key={primaryColor + avatar + firstMessage + alignment}
            userId={userId}
            apiBase={apiBase}
            primaryColor={primaryColor}
            avatar={avatar}
            firstMessage={firstMessage}
            alignment={alignment}
            onClose={() => setShowChat(false)}
          />
        )}
      </div>
    </div>
  );
};

export default CustomChatPage;
