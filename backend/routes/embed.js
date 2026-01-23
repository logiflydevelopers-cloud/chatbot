import express from "express";
import ChatbotSetting from "../models/ChatbotSetting.js";

const router = express.Router();

router.get("/:userId.js", async (req, res) => {
  const { userId } = req.params;

  const setting = await ChatbotSetting.findOne({ userId });
  const alignment = setting?.alignment === "left" ? "left" : "right";

  const FRONTEND_URL =
    process.env.FRONTEND_URL || "http://localhost:3000";
  const BACKEND_URL =
    process.env.BACKEND_URL || "http://localhost:4000";

  /* ======================================================
        🔥 AVATAR KEY → PUBLIC URL
        DB:  b-image-03
        URL: http://localhost:3000/avatars/b-image-03.svg
  ====================================================== */
  const avatarKey = setting?.avatar || "";
  const avatarUrl = avatarKey
    ? `${FRONTEND_URL}/avatars/${avatarKey}.svg`
    : "";

  const script = `
(function () {

  if (
    document.getElementById("chatbot-bubble-${userId}") ||
    document.getElementById("chatbot-iframe-${userId}")
  ) return;

  /* ===== GLOBAL CONFIG ===== */
  window.CHATBOT_API_BASE = "${BACKEND_URL}";
  window.CHATBOT_ALIGNMENT = "${alignment}";
  window.CHATBOT_SETTINGS = {
    avatar: "${avatarUrl}",
    primaryColor: "${setting?.primaryColor || "#6b5cff"}",
    firstMessage: "${setting?.firstMessage || "Hi! How can I help you?"}"
  };

  /* ===== BUBBLE ===== */
  const bubble = document.createElement("div");
  bubble.id = "chatbot-bubble-${userId}";
  bubble.style.position = "fixed";
  bubble.style.bottom = "20px";
  bubble.style.${alignment} = "20px";
  bubble.style.width = "46px";
  bubble.style.height = "46px";
  bubble.style.borderRadius = "50%";
  bubble.style.background = "#fff";
  bubble.style.border = "2px solid ${setting?.primaryColor || "#6b5cff"}";
  bubble.style.display = "flex";
  bubble.style.alignItems = "center";
  bubble.style.justifyContent = "center";
  bubble.style.cursor = "pointer";
  bubble.style.zIndex = "999999";
  bubble.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
  bubble.innerHTML =
    "<img src='${avatarUrl}' style='width:40px;height:40px;border-radius:50%' />";

  document.body.appendChild(bubble);

  /* ===== IFRAME ===== */
  const iframe = document.createElement("iframe");
  iframe.id = "chatbot-iframe-${userId}";
  iframe.src =
  "${FRONTEND_URL}/embed/chat/${userId}" +
  "?avatar=${encodeURIComponent(avatarUrl)}" +
  "&color=${encodeURIComponent(setting?.primaryColor || "#6b5cff")}" +
  "&msg=${encodeURIComponent(setting?.firstMessage || "Hi! How can I help you?")}";

  iframe.style.position = "fixed";
  iframe.style.bottom = "20px";
  iframe.style.${alignment} = "20px";
  iframe.style.width = "300px";
  iframe.style.height = "460px";
  iframe.style.border = "none";
  iframe.style.borderRadius = "30px";
  iframe.style.boxShadow = "0px 4px 4px 0px #00000025";
  iframe.style.zIndex = "999999";
  iframe.style.display = "none";

  document.body.appendChild(iframe);

  bubble.addEventListener("click", () => {
    bubble.style.display = "none";
    iframe.style.display = "block";
  });

  window.addEventListener("message", (e) => {
    if (e.data === "CLOSE_CHATBOT") {
      iframe.style.display = "none";
      bubble.style.display = "flex";
    }
  });

})();
`;

  res.setHeader("Content-Type", "application/javascript");
  res.setHeader("Cache-Control", "no-store");
  res.send(script);
});

export default router;
