import React, { useState, useEffect } from "react";
import axios from "axios";
import ChatBotDrawer from "../Components/Auth/ChatBotDrawer";
import { useNavigate } from "react-router-dom";

// ⭐ IMPORT IMAGES
import Ellipse90 from "../image/Ellipse 90.png";
import Ellipse91 from "../image/Ellipse 91.png";
import Ellipse92 from "../image/Ellipse 92.png";
import Ellipse93 from "../image/Ellipse 93.png";

const CustomChatPage = () => {
  const navigate = useNavigate();
  const apiBase = "https://chatbot-backend-project.vercel.app";

  /* ===============================
     🔐 GET USER FROM STORAGE (SOURCE OF TRUTH)
  =============================== */
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId =
    storedUser?._id || storedUser?.id || storedUser?.userId || null;

  /* ===============================
     STATE
  =============================== */
  const [avatar, setAvatar] = useState(Ellipse90);
  const [firstMessage, setFirstMessage] = useState(
    "Hi there 👋 I'm your assistant!"
  );
  const [primaryColor, setPrimaryColor] = useState("#2563eb");
  const [alignment, setAlignment] = useState("right");
  const [selectedWebsite, setSelectedWebsite] = useState(null);

  const [showChat, setShowChat] = useState(true);
  const [showBubble, setShowBubble] = useState(false);
  const [isCustomizerMode] = useState(true);

  /* ===============================
     🔴 REDIRECT IF NOT LOGGED IN
  =============================== */
  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, [userId, navigate]);

  /* ===============================
     ⭐ CHECK KNOWLEDGE (DB BASED)
     👉 THIS FIXES YOUR ISSUE
  =============================== */
  useEffect(() => {
    if (!userId) return;

    const checkKnowledge = async () => {
      try {
        const res = await axios.get(
          `${apiBase}/api/chatbot/knowledge-status/${userId}`
        );

        if (!res.data?.hasKnowledge) {
          alert("⚠️ Please upload FILE, LINK or add Q&A first.");
          navigate("/dashboard/knowledge");
        }
      } catch (err) {
        console.error("Knowledge check failed:", err);
      }
    };

    checkKnowledge();
  }, [userId, navigate]);

  /* ===============================
     ⭐ LOAD CHATBOT SETTINGS FROM DB
  =============================== */
  useEffect(() => {
    if (!userId) return;

    const fetchSettings = async () => {
      try {
        const res = await axios.get(
          `${apiBase}/api/chatbot/${userId}`
        );

        if (res.data?.settings) {
          const s = res.data.settings;

          setAvatar(
            s.avatar === "Ellipse91"
              ? Ellipse91
              : s.avatar === "Ellipse92"
                ? Ellipse92
                : s.avatar === "Ellipse93"
                  ? Ellipse93
                  : Ellipse90
          );

          setFirstMessage(
            s.firstMessage || "Hi there 👋 I'm your assistant!"
          );
          setPrimaryColor(s.primaryColor || "#2563eb");
          setAlignment(s.alignment || "right");
          setSelectedWebsite(s.website || null);
        }
      } catch (err) {
        console.warn("Settings load failed:", err.message);
      }
    };

    fetchSettings();
  }, [userId]);

  /* ===============================
     💾 SAVE CUSTOMIZATION
  =============================== */
  const saveCustomization = async () => {
    try {
      const payload = {
        userId,
        avatar:
          avatar === Ellipse91
            ? "Ellipse91"
            : avatar === Ellipse92
              ? "Ellipse92"
              : avatar === Ellipse93
                ? "Ellipse93"
                : "Ellipse90",
        firstMessage,
        primaryColor,
        alignment,
        website: selectedWebsite || null,
      };

      const res = await axios.post(
        `${apiBase}/api/chatbot/save`,
        payload
      );

      if (res.data?.success) {
        alert("✅ Customization Saved Successfully!");
        localStorage.setItem(
          "chatbot_settings",
          JSON.stringify(payload)
        );
        localStorage.setItem("chatbotSaved", "true");
      } else {
        alert("❌ Save failed");
      }
    } catch (err) {
      alert("❌ Save Failed");
    }
  };

  const avatarOptions = [Ellipse90, Ellipse91, Ellipse92, Ellipse93];

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>

      {/* SAVE BUTTON */}
      <div
        style={{
          position: "fixed",
          top: "90px",
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

      {/* LEFT PANEL */}
      <div
        style={{
          width: "300px",
          background: "#f3f4f6",
          padding: "20px",
          borderRight: "1px solid #d1d5db",
          marginTop: "60px",
          overflowY: "auto",
        }}
      >
        <h3>Customize</h3>

        <label>Choose Avatar</label>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {avatarOptions.map((img) => (
            <img
              key={img}
              src={img}
              alt="avatar"
              onClick={() => setAvatar(img)}
              style={{
                width: 55,
                height: 55,
                borderRadius: "50%",
                border:
                  avatar === img
                    ? "3px solid #2563eb"
                    : "2px solid #ccc",
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
          style={{ width: "100%", height: "40px" }}
        />

        <label>Welcome Message</label>
        <textarea
          value={firstMessage}
          onChange={(e) => setFirstMessage(e.target.value)}
          rows={3}
          style={{ width: "100%", padding: 10 }}
        />

        <label>Chat Position</label>
        <select
          value={alignment}
          onChange={(e) => setAlignment(e.target.value)}
          style={{ width: "100%", padding: 10 }}
        >
          <option value="right">Right</option>
          <option value="left">Left</option>
        </select>
      </div>

      {/* CHAT PREVIEW */}
      {/* CHAT + WEBSITE PREVIEW */}
      <div
        style={{
          flex: 1,
          marginTop: "60px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/*  WEBSITE BACKGROUND PREVIEW */}
        {selectedWebsite && (
          <iframe
            src={selectedWebsite}
            title="Website Preview"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              border: "none",
              zIndex: 1,
            }}
          />
        )}

        {/* 🤖 CHATBOT OVERLAY */}
        {showChat && (
          <ChatBotDrawer
            key={primaryColor + avatar + firstMessage + alignment}
            userId={userId}
            apiBase={apiBase}
            primaryColor={primaryColor}
            avatar={avatar}
            firstMessage={firstMessage}
            alignment={alignment}
            isCustomizerMode={isCustomizerMode}
            onClose={() => {
              setShowChat(false);
              setShowBubble(true);
            }}
            style={{ zIndex: 9999 }}
          />
        )}
      </div>

    </div>
  );
};

export default CustomChatPage;
