import express from "express";
import ChatbotSetting from "../models/ChatbotSetting.js";

const router = express.Router();

router.get("/:userId.js", async (req, res) => {
  const { userId } = req.params;

  // Fetch alignment from DB
  const setting = await ChatbotSetting.findOne({ userId });
  const alignment = setting?.alignment === "left" ? "left" : "right";

  // IMPORTANT: Dynamic Backend + Frontend BASE URLs
  const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
  const BACKEND_URL = process.env.BACKEND_URL || "https://demo-chatbot-backend.vercel.app/";

  const script = `
    (function () {

      if (document.getElementById("chatbot-iframe-${userId}")) return;

      // Pass backend URL to iframe
      window.CHATBOT_API_BASE = "${BACKEND_URL}";

      const iframe = document.createElement("iframe");
      iframe.id = "chatbot-iframe-${userId}";
      iframe.src = "${FRONTEND_URL}/embed/chat/${userId}";
      iframe.style.position = "fixed";
      iframe.style.bottom = "20px";
      iframe.style.${alignment} = "20px";
      iframe.style.width = "380px";
      iframe.style.height = "600px";
      iframe.style.border = "none";
      iframe.style.borderRadius = "12px";
      iframe.style.zIndex = "999999";

      document.body.appendChild(iframe);

    })();
  `;

  res.setHeader("Content-Type", "application/javascript");
  res.send(script);
});

export default router;
