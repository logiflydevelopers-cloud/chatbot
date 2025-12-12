import React, { useState, useEffect } from "react";
import axios from "axios";
import ChatBotDrawer from "../Components/Auth/ChatBotDrawer";
import { useParams, useNavigate } from "react-router-dom";

// ⭐ IMPORT IMAGES FROM src/image
import Ellipse90 from "../image/Ellipse 90.png";
import Ellipse91 from "../image/Ellipse 91.png";
import Ellipse92 from "../image/Ellipse 92.png";
import Ellipse93 from "../image/Ellipse 93.png";

const CustomChatPage = ({ user }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const apiBase = "http://localhost:4000";

  // ⭐ DEFAULT AVATAR = Ellipse90
  const [avatar, setAvatar] = useState(Ellipse90);
  const [firstMessage, setFirstMessage] = useState("Hi there 👋 I'm your assistant!");
  const [primaryColor, setPrimaryColor] = useState("#2563eb");
  const [alignment, setAlignment] = useState("right");

  const [selectedWebsite, setSelectedWebsite] = useState(null);

  const [showChat, setShowChat] = useState(true);
  const [showBubble, setShowBubble] = useState(false);
  const [isCustomizerMode] = useState(true);

  /* REDIRECT IF NOT LOGGED IN */
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  /* LOAD CHATBOT SETTINGS FROM DATABASE */
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${apiBase}/api/chatbot/${userId}`);

        if (res.data.success && res.data.settings) {
          const s = res.data.settings;

          // ⭐ Map DB avatar string to imported images
          setAvatar(
            s.avatar === "Ellipse91" ? Ellipse91 :
            s.avatar === "Ellipse92" ? Ellipse92 :
            s.avatar === "Ellipse93" ? Ellipse93 :
            Ellipse90
          );

          setFirstMessage(s.firstMessage || "Hi there 👋 I'm your assistant!");
          setPrimaryColor(s.primaryColor || "#2563eb");
          setAlignment(s.alignment || "right");

          if (s.website) setSelectedWebsite(s.website);
        }
      } catch (error) {
        console.warn("DB load error →", error.message);
      }
    };

    fetchSettings();
  }, [userId]);

  /* CHECK TRAINING DATA */
  useEffect(() => {
    const checkTrainingData = async () => {
      try {
        const [pdfRes, linkRes, qaRes] = await Promise.all([
          axios.get(`${apiBase}/api/page/pdf/${userId}`),
          axios.get(`${apiBase}/api/page/link/${userId}`),
          axios.get(`${apiBase}/api/qa/user/${userId}`),
        ]);

        const hasPDF = pdfRes.data?.length > 0;
        const hasLinks = linkRes.data?.length > 0;
        const hasQA = qaRes.data?.length > 0;

        if (!hasPDF && !hasLinks && !hasQA) {
          alert("⚠ Please upload FILE, LINK or add Q&A first.");
          navigate("/dashboard/train");
        }
      } catch (err) {
        console.log("Training data check failed →", err.message);
      }
    };

    checkTrainingData();
  }, [userId, navigate]);

  /* SAVE CUSTOMIZATION TO DB */
  const saveCustomization = async () => {
    try {
      const payload = {
        userId,

        // ⭐ convert imported image → DB string
        avatar:
          avatar === Ellipse91 ? "Ellipse91" :
          avatar === Ellipse92 ? "Ellipse92" :
          avatar === Ellipse93 ? "Ellipse93" :
          "Ellipse90",

        firstMessage,
        primaryColor,
        alignment,
        website: selectedWebsite || null,
      };

      const res = await axios.post(`${apiBase}/api/chatbot/save`, payload);

      if (res.data.success) {
        alert("Customization Saved Successfully!");
        localStorage.setItem("chatbot_settings", JSON.stringify(payload));
        localStorage.setItem("chatbotSaved", "true");
      } else {
        alert("Save failed");
      }
    } catch (error) {
      alert("Save Failed");
    }
  };

  /* ⭐ AVATAR OPTIONS */
  const avatarOptions = [Ellipse90, Ellipse91, Ellipse92, Ellipse93];

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

      {/* LEFT PANEL */}
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

        {/* ⭐ AVATAR SELECT */}
        <label>Choose Avatar</label>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
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
                border: avatar === img ? "3px solid #2563eb" : "2px solid #ccc",
                padding: "3px",
                cursor: "pointer",
                objectFit: "cover",
              }}
            />
          ))}
        </div>

        {/* ⭐ THEME COLOR */}
        <label>Chat Theme Color</label>
        <input
          type="color"
          value={primaryColor}
          onChange={(e) => setPrimaryColor(e.target.value)}
          style={{ width: "100%", height: "40px", marginBottom: 15 }}
        />

        {/* ⭐ WELCOME MESSAGE */}
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

        {/* ⭐ CHAT POSITION */}
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
      </div>

      {/* CHAT PREVIEW */}
      <div style={{ flex: 1, position: "relative", marginTop: "50px" }}>
        {showBubble && (
          <div
            onClick={() => {
              setShowBubble(false);
              setShowChat(true);
            }}
            style={{
              position: "fixed",
              bottom: "30px",
              right: alignment === "right" ? "30px" : "unset",
              left: alignment === "left" ? "30px" : "unset",
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              background: primaryColor,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#fff",
              fontSize: "35px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
              zIndex: 99999,
            }}
          >
            💬
          </div>
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
