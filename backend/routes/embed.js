import express from "express";
import ChatbotSetting from "../models/ChatbotSetting.js";

const router = express.Router();

router.get("/:userId.js", async (req, res) => {
  const { userId } = req.params;

  const setting = await ChatbotSetting.findOne({ userId });
  const alignment = setting?.alignment === "left" ? "left" : "right";

  const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
  const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

  const script = `
(function () {

  /* ======================================================
        STOP DUPLICATE CHATBOT LOADING
  ====================================================== */
  if (document.getElementById("chatbot-bubble-${userId}") ||
      document.getElementById("chatbot-iframe-${userId}")) {
    return;
  }

  window.CHATBOT_API_BASE = "${BACKEND_URL}";
  window.CHATBOT_ALIGNMENT = "${alignment}";


  /* ======================================================
          ⭐ CREATE BUBBLE BUTTON
  ====================================================== */
  const bubble = document.createElement("div");
  bubble.id = "chatbot-bubble-${userId}";
  bubble.style.position = "fixed";
  bubble.style.bottom = "20px";
  bubble.style.${alignment} = "20px";
  bubble.style.width = "70px";
  bubble.style.height = "70px";
  bubble.style.borderRadius = "50%";
  bubble.style.background = "#fff";
  bubble.style.border = "2px solid #ddd";
  bubble.style.display = "flex";
  bubble.style.alignItems = "center";
  bubble.style.justifyContent = "center";
  bubble.style.cursor = "pointer";
  bubble.style.zIndex = "999999";
  bubble.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
  bubble.innerHTML = "<img src='https://cdn-icons-png.flaticon.com/512/4712/4712100.png' style='width:40px;height:40px;' />";

  document.body.appendChild(bubble);


  /* ======================================================
          ⭐ CREATE CHATBOT IFRAME
  ====================================================== */
  const iframe = document.createElement("iframe");
  iframe.id = "chatbot-iframe-${userId}";
  iframe.src = "${FRONTEND_URL}/embed/chat/${userId}";
  iframe.style.position = "fixed";
  iframe.style.bottom = "20px";
  iframe.style.${alignment} = "20px";
  iframe.style.width = "330px";
  iframe.style.height = "460px";
  iframe.style.border = "none";
  iframe.style.borderRadius = "14px";
  iframe.style.boxShadow = "0 4px 20px rgba(0,0,0,0.25)";
  iframe.style.zIndex = "999999";
  iframe.style.display = "none";   // hidden initially

  document.body.appendChild(iframe);


  /* ======================================================
          ⭐ OPEN CHATBOT (on bubble click)
  ====================================================== */
  bubble.addEventListener("click", () => {
    bubble.style.display = "none";
    iframe.style.display = "block";
  });


  /* ======================================================
          ⭐ CLOSE CHATBOT (from iframe -> parent)
          Called when ChatBotDrawerEmbed.jsx runs: 
          window.parent.postMessage("CLOSE_CHATBOT")
  ====================================================== */
  window.addEventListener("message", function (event) {
    if (event.data === "CLOSE_CHATBOT") {
      iframe.style.display = "none";   // hide chatbot
      bubble.style.display = "flex";   // show bubble again
    }
  });

})();
`;

  res.setHeader("Content-Type", "application/javascript");
  res.send(script);
});

export default router;
