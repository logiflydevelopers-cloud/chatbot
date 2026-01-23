import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ChatBotDrawer from "../Components/Auth/ChatBotDrawer";
import "./CustomChatPage.css";
import ColorPicker from "../Components/Auth/ColorPicker";

/* =========================
   DEFAULT AVATARS
========================= */
import gImage00 from "../image/chatbot-defulte-logo.svg";
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
  "chatbot-defulte-logo": gImage00,
  "g-image-01": gImage01,
  "g-image-02": gImage02,
  "g-image-03": gImage03,
  "g-image-04": gImage04,
  "b-image-01": bImage01,
  "b-image-02": bImage02,
  "b-image-03": bImage03,
};




const CustomChatPage = () => {
  /* =========================
     EMBED MODE
  ========================= */
  const params = new URLSearchParams(window.location.search);
  const isEmbed = params.get("embed") === "1";
  const embedUserId = params.get("userId");


  const navigate = useNavigate();
  const apiBase = "http://localhost:4000";
  const fileInputRef = useRef(null);

  /* =========================
     WEBSITE STATE 🔥
  ========================= */
  const [website, setWebsite] = useState(null);

  /* =========================
     USER ID
  ========================= */
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = isEmbed
    ? embedUserId
    : storedUser?._id || storedUser?.id || storedUser?.userId || null;

  const isMobile = window.innerWidth <= 768;

  /* =========================
     STATES
  ========================= */
  const [avatar, setAvatar] = useState("chatbot-defulte-logo");
  const [customAvatar, setCustomAvatar] = useState(null);
  const [firstMessage, setFirstMessage] = useState(
    "Hi there 👋 I'm your assistant!"
  );

  // 🔥 previewMessage should have its own default
  const [previewMessage, setPreviewMessage] = useState(
    "Hi there 👋 I'm your assistant!"
  );
  const [primaryColor, setPrimaryColor] = useState("#667eeb");
  const [alignment, setAlignment] = useState("right");

  const [showChat, setShowChat] = useState(isEmbed ? true : !isMobile);
  const [showBubble, setShowBubble] = useState(isEmbed ? false : isMobile);

  /* =========================
     AUTH GUARD
  ========================= */
  useEffect(() => {
    if (!isEmbed && !userId) navigate("/login");
  }, [isEmbed, userId, navigate]);

  /* =========================
     LOAD SETTINGS
  ========================= */
  useEffect(() => {
    if (!userId) return;

    axios.get(`${apiBase}/api/chatbot/${userId}`).then((res) => {
      const s = res.data?.settings;
      if (!s) return;

      const welcome =
        s.firstMessage?.trim() || "Hi there 👋 I'm your assistant!";

      setFirstMessage(welcome);
      setPreviewMessage(welcome); // 🔥 sync saved message

      if (s.avatar?.startsWith("data:image")) {
        setCustomAvatar(s.avatar);
        setAvatar("custom");
      } else {
        setAvatar(s.avatar || "b-image-03");
      }

      setPrimaryColor(s.primaryColor || "#667eeb");
      setAlignment(s.alignment || "right");
      setWebsite(s.website || null);
    });
  }, [userId]);


  /* =========================
     RESIZE HANDLER
  ========================= */
  useEffect(() => {
    if (isEmbed) return;

    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setShowChat(!mobile);
      setShowBubble(mobile);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isEmbed]);

  /* =========================
     AVATAR UPLOAD
  ========================= */
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/png", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      alert("Only PNG or SVG allowed");
      return;
    }

    const imageUrl = URL.createObjectURL(file); // 🔥 sharp image
    setCustomAvatar(imageUrl);
    setAvatar("custom");
  };



  /* =========================
     SAVE
  ========================= */
  const saveCustomization = async () => {
    try {
      // 1️⃣ show loading popup immediately
      setPopup({ show: true, stage: "loading" });

      const payload = {
        userId,
        avatar: avatar === "custom" ? customAvatar : avatar,
        firstMessage,
        primaryColor,
        alignment,
      };

      // 2️⃣ API call
      const res = await axios.post(`${apiBase}/api/chatbot/save`, payload);

      if (res.data?.success) {
        setPreviewMessage(firstMessage);

        // 3️⃣ wait 2 seconds, then show success
        setTimeout(() => {
          setPopup({ show: true, stage: "success" });
        }, 2000);
      }
    } catch (error) {
      setTimeout(() => {
        setPopup({ show: true, stage: "error" });
      }, 2000);
    }
  };



  const [popup, setPopup] = useState({
    show: false,
    stage: "loading",
  });


  const removeCustomAvatar = () => {
    setCustomAvatar(null);
    setAvatar("b-image-03");
  };

  const avatarKeys = Object.keys(avatarMap);

  return (
    <div className={`custom-chat-page align-${alignment}`}>

      {/* =========================
          🌐 WEBSITE BACKGROUND (LIVE)
      ========================= */}
      {website && (
        <iframe
          src={website}
          title="Training Website"
          className="website-background"
          sandbox="allow-same-origin allow-scripts allow-forms"
        />
      )}

      {/* =========================
          CUSTOMIZER PANEL
      ========================= */}
      <div className="customizer-panel">
        <h3 className="customize-btn">Customize</h3>

        {/* AVATARS */}
        <div className="choose-avatar">
          <div className="customize-title">Choose Avatar</div>
          <div className="avatar-list">
            {avatarKeys.map((key) => (
              <img
                key={key}
                src={avatarMap[key]}
                alt={key}
                className={`avatar-item ${avatar === key ? "active" : ""}`}
                onClick={() => setAvatar(key)}
              />
            ))}

            {customAvatar && (
              <div className="custom-avatar-wrapper">
                <img
                  src={customAvatar}
                  alt="custom"
                  className={`avatar-item ${avatar === "custom" ? "active" : ""}`}
                  onClick={() => setAvatar("custom")}
                />
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

            <div
              className="avatar-item upload"
              onClick={() => fileInputRef.current.click()}
            >
              +
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/svg+xml"
              hidden
              onChange={handleAvatarUpload}
            />

          </div>
        </div>

        {/* COLOR */}
        <div className="color">
          <div className="customize-title">Chat Theme Color</div>
          <ColorPicker value={primaryColor} onChange={setPrimaryColor} />
        </div>

        {/* MESSAGE */}
        <div className="welcome-message">
          <div className="customize-title">Welcome Message</div>
          <textarea
            rows={3}
            value={firstMessage}
            onChange={(e) => {
              const value = e.target.value;
              setFirstMessage(value);
              setPreviewMessage(value);
            }}
          />

        </div>

        {/* POSITION */}
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

        <div className="save-bar">
          <button className="save-btn" onClick={saveCustomization}>
            Save
          </button>
        </div>
      </div>

      {/* CHAT PREVIEW */}
      <ChatBotDrawer
        userId={userId}
        apiBase={apiBase}
        primaryColor={primaryColor}
        avatar={avatar === "custom" ? customAvatar : avatarMap[avatar]}
        firstMessage={previewMessage}
        alignment={alignment}
        showChat={showChat}
        showBubble={showBubble}
        onClose={() => {
          setShowChat(false);
          setShowBubble(true);
        }}
        onBubbleClick={() => {
          setShowBubble(false);
          setShowChat(true);
        }}
      />


      {popup.show && (
        <div className="popup-overlay">
          <div className="popup-box">

            {/* 🔄 LOADING STATE */}
            {popup.stage === "loading" && (
              <>
                <div className="loader"></div>
                <p>Saving your customization...</p>
              </>
            )}

            {/* ✅ SUCCESS STATE */}
            {popup.stage === "success" && (
              <>
                <h3>🎉 Successfully Saved!</h3>
                <p>Your chatbot is ready to publish.</p>

                <div className="popup-actions">
                  <button
                    className="publish-btn"
                    onClick={() => navigate(`/embed-code/${userId}`)}
                  >
                    Publish
                  </button>

                  <button
                    className="cancel-btn"
                    onClick={() => setPopup({ show: false })}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}

            {/* ❌ ERROR STATE */}
            {popup.stage === "error" && (
              <>
                <h3>❌ Save Failed</h3>
                <p>Please try again.</p>
                <button onClick={() => setPopup({ show: false })}>Close</button>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomChatPage;
