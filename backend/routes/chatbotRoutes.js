import express from "express";
import {
  saveChatbotSettings,
  getChatbotSettings,
  chatWithBot
} from "../controllers/chatbotController.js";

import Page from "../models/Page.js";
import QA from "../models/QA.js";
import ChatbotSetting from "../models/ChatbotSetting.js";

const router = express.Router();

/* ===============================
   SAVE / GET SETTINGS
================================ */
router.post("/save", saveChatbotSettings);
router.get("/:userId", getChatbotSettings);

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

    const hasPages = await Page.exists({ userId });
    const hasQA = await QA.exists({ userId });
    const settings = await ChatbotSetting.findOne({ userId });

    const hasWebsite = !!settings?.website;

    res.json({
      hasKnowledge: Boolean(hasPages || hasQA || hasWebsite),
      hasPages: Boolean(hasPages),
      hasQA: Boolean(hasQA),
      hasWebsite
    });
  } catch (err) {
    console.error("Knowledge status error:", err);
    res.status(500).json({ hasKnowledge: false });
  }
});

export default router;
