import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SketchPicker } from "react-color";
import ChatBotDrawer from "../Components/Auth/ChatBotDrawer";
import "./CustomChatPage.css";

/* =========================
   DEFAULT AVATARS
========================= */
import gImage01 from "../image/g-image-01.svg";
import gImage02 from "../image/g-image-02.svg";
import gImage03 from "../image/g-image-03.svg";
import gImage04 from "../image/g-image-04.svg";
import bImage01 from "../image/b-image-01.svg";
import bImage02 from "../image/b-image-02.svg";
import bImage03 from "../image/b-image-03.svg";

/* =========================
   AVATAR MAP
========================= */
const avatarMap = {
  "g-image-01": gImage01,
  "g-image-02": gImage02,
  "g-image-03": gImage03,
  "g-image-04": gImage04,
  "b-image-01": bImage01,
  "b-image-02": bImage02,
  "b-image-03": bImage03,
};

const CustomChatPage = () => {
  // 🔥 EMBED MODE DETECTION (ADD THIS)
  const params = new URLSearchParams(window.location.search);
  const isEmbed = params.get("embed") === "1";
  const embedUserId = params.get("userId");


  const navigate = useNavigate();
  const apiBase = "http://localhost:4000";
  const fileInputRef = useRef(null);


  // 🔥 FINAL USER ID (VERY IMPORTANT)
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = isEmbed
    ? embedUserId
    : storedUser?._id || storedUser?.id || storedUser?.userId || null;


  const isMobile = window.innerWidth <= 768;

  /* =========================
     STATES
  ========================= */
  const [avatar, setAvatar] = useState("b-image-03");
  const [customAvatar, setCustomAvatar] = useState(null);
  const [firstMessage, setFirstMessage] = useState(
    "Hi there 👋 I'm your assistant!"
  );
  const [primaryColor, setPrimaryColor] = useState("#2563eb");
  const [alignment, setAlignment] = useState("right");

  // Desktop open | Mobile closed
  const [showChat, setShowChat] = useState(isEmbed ? true : !isMobile);
  const [showBubble, setShowBubble] = useState(isEmbed ? false : isMobile);


  /* =========================
     AUTH GUARD
  ========================= */
  useEffect(() => {
    if (!isEmbed && !userId) {
      navigate("/login");
    }
  }, [isEmbed, userId, navigate]);


  /* =========================
     LOAD SETTINGS
  ========================= */
  useEffect(() => {
    if (!userId) return;

    axios.get(`${apiBase}/api/chatbot/${userId}`).then((res) => {
      const s = res.data?.settings;
      if (!s) return;

      if (s.avatar?.startsWith("data:image")) {
        setCustomAvatar(s.avatar);
        setAvatar("custom");
      } else {
        setAvatar(s.avatar || "b-image-03");
      }

      setFirstMessage(s.firstMessage || "");
      setPrimaryColor(s.primaryColor || "#2563eb");
      setAlignment(s.alignment || "right");
    });
  }, [userId]);

  /* =========================
     RESIZE HANDLER
  ========================= */
  useEffect(() => {
    if (isEmbed) return; // 🔥 DO NOTHING IN EMBED

    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setShowChat(!mobile);
      setShowBubble(mobile);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isEmbed]);


  /* =========================
     UPLOAD AVATAR
  ========================= */
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setCustomAvatar(reader.result);
      setAvatar("custom");
    };
    reader.readAsDataURL(file);
  };

  /* =========================
     SAVE
  ========================= */
  const saveCustomization = async () => {
    try {
      const payload = {
        userId,
        avatar: avatar === "custom" ? customAvatar : avatar,
        firstMessage,
        primaryColor,
        alignment,
      };

      const res = await axios.post(
        `${apiBase}/api/chatbot/save`,
        payload
      );

      if (res.data?.success) {
        localStorage.setItem("chatbotSaved", "true");
        alert("✅ Customization Saved Successfully!");
      }

    } catch {
      alert("❌ Save Failed");
    }
  };

  const removeCustomAvatar = () => {
    setCustomAvatar(null);
    setAvatar("b-image-03"); // fallback default avatar
  };


  const avatarKeys = Object.keys(avatarMap);

  return (
    <div className="custom-chat-page">
      {/* =========================
          CUSTOMIZER PANEL
      ========================= */}
      <div className="customizer-panel">
        {/* HEADER */}
        <h3 className="customize-btn">Customize</h3>

        {/* CHOOSE AVATAR */}
        <div className="choose-avatar">
          <div className="customize-title">Choose Avatar</div>

          <div className="avatar-list">
            {/* DEFAULT AVATARS */}
            {avatarKeys.map((key) => (
              <img
                key={key}
                src={avatarMap[key]}
                alt={key}
                className={`avatar-item ${avatar === key ? "active" : ""}`}
                onClick={() => setAvatar(key)}
              />
            ))}

            {/* CUSTOM AVATAR PREVIEW */}
            {customAvatar && (
              <div className="custom-avatar-wrapper">
                <img
                  src={customAvatar}
                  alt="custom-avatar"
                  className={`avatar-item ${avatar === "custom" ? "active" : ""}`}
                  onClick={() => setAvatar("custom")}
                />

                {/* REMOVE BUTTON */}
                <span
                  className="remove-avatar"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCustomAvatar();
                  }}
                >
                  ✕
                </span>
              </div>
            )}


            {/* UPLOAD BUTTON */}
            <div
              className={`avatar-item upload`}
              onClick={() => fileInputRef.current.click()}
            >
              +
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarUpload}
            />

          </div>

        </div>

        {/* COLOR PICKER */}
        <div className="color">
          <div className="customize-title">Chat Theme Color</div>
          <SketchPicker
            color={primaryColor}
            onChange={(c) => setPrimaryColor(c.hex)}
          />
        </div>

        {/* WELCOME MESSAGE */}
        <div className="welcome-message">
          <div className="customize-title">Welcome Message</div>
          <textarea
            rows={3}
            value={firstMessage}
            onChange={(e) => setFirstMessage(e.target.value)}
          />
        </div>

        {/* CHAT POSITION */}
        <div className="chat-position">
          <div className="customize-title">Chat Position</div>
          <select
            value={alignment}
            onChange={(e) => setAlignment(e.target.value)}
          >
            <option value="right">Right</option>
            <option value="left">Left</option>
          </select>
        </div>

        {/* SAVE / PREVIEW BAR */}
        <div className="save-bar">
          <button className="save-btn" onClick={saveCustomization}>
            Save
          </button>

          <button
            className="preview-btn"
            onClick={() => {
              setShowChat(true);
              setShowBubble(false);
            }}
          >
            Preview
          </button>
        </div>
      </div>

      {/* =========================
          CHATBOT PREVIEW
      ========================= */}
      <ChatBotDrawer
        userId={userId}
        apiBase={apiBase}
        primaryColor={primaryColor}
        avatar={avatar === "custom" ? customAvatar : avatarMap[avatar]}
        firstMessage={firstMessage}
        alignment={alignment}
        showChat={isEmbed ? true : showChat}
        showBubble={isEmbed ? false : showBubble}
        onClose={() => {
          if (isEmbed) {
            window.parent.postMessage("CLOSE_CHATBOT", "*");
          } else {
            setShowChat(false);
            setShowBubble(true);
          }
        }}

        onBubbleClick={() => {
          setShowBubble(false);
          setShowChat(true);
        }}
      />

    </div>
  );
};

export default CustomChatPage;
