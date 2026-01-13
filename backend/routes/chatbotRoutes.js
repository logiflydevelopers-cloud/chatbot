import express from "express";
import {
  saveChatbotSettings,
  getChatbotSettings,
  chatWithBot,
  registerLead          // ✅ NEW IMPORT
} from "../controllers/chatbotController.js";

import QA from "../models/QA.js";
import ChatbotSetting from "../models/ChatbotSetting.js";

const router = express.Router();

/* ===============================
   SAVE / GET SETTINGS
================================ */
router.post("/save", saveChatbotSettings);
router.get("/:userId", getChatbotSettings);

/* ===============================
   ⭐ REGISTER CHAT LEAD (EMAIL CAPTURE)
================================ */
router.post("/register-lead", registerLead);   // ✅ NEW ROUTE

/* ===============================
   MAIN CHAT ENDPOINT
================================ */
router.post("/chat", chatWithBot);

/* ===============================
   ⭐ KNOWLEDGE STATUS (SOURCE OF TRUTH)
================================ */
router.get("/knowledge-status/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const bot = await ChatbotSetting.findOne({ userId });

    const hasWebsite = !!bot?.website; // ✅ ONLY WEBSITE

    res.json({
      hasWebsite
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch knowledge status"
    });
  }
});

export default router;
