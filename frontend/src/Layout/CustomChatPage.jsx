import React, { useState, useEffect } from "react";
import axios from "axios";
import ChatBotDrawer from "../Components/Auth/ChatBotDrawer";
import { useNavigate } from "react-router-dom";
import "./CustomChatPage.css";
import { SketchPicker } from "react-color";


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

  <SketchPicker
    color={primaryColor}
    onChange={(color) => {
      setPrimaryColor(color.hex);
    }}
  />

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
    <div className="custom-chat-page">

      {/* LEFT PANEL */}
      <div className="customizer-panel">
        <h3 className="customize-btn">Customize</h3>

        <div className="choose-avatar">
          <label className="customize-title">Choose Avatar</label>
          <div className="avatar-list">
            {avatarOptions.map((img) => (
              <img
                key={img}
                src={img}
                alt="avatar"
                onClick={() => setAvatar(img)}
                className={`avatar-item ${avatar === img ? "active" : ""}`}
              />
            ))}
          </div>
        </div>

        <div className="color">
          <label className="customize-title">Chat Theme Color</label>
          <SketchPicker
            color={primaryColor}
            onChange={(color) => setPrimaryColor(color.hex)}
          />
        </div>


        <div className="welcome-message">
          <label className="customize-title">Welcome Message</label>
          <textarea
            rows={3}
            value={firstMessage}
            onChange={(e) => setFirstMessage(e.target.value)}
          />
        </div>

        <div className="chat-position">
          <label className="customize-title">Chat Position</label>
          <select
            value={alignment}
            onChange={(e) => setAlignment(e.target.value)}
          >
            <option value="right">Right</option>
            <option value="left">Left</option>
          </select>
        </div>

        {/* SAVE BUTTON */}
        <div className="save-bar">
          <button className="save-btn" onClick={saveCustomization}>
            Save
          </button>
        </div>
      </div>

      {/* CHAT PREVIEW */}
      <div className="chat-preview">

        {selectedWebsite && (
          <iframe
            src={selectedWebsite}
            title="Website Preview"
            className="website-preview"
          />
        )}

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
          />
        )}
      </div>

    </div>
  );
};

export default CustomChatPage;
