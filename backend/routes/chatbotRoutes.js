// backend/routes/chatbotRoutes.js

import express from "express";
import {
  saveChatbotSettings,
  getChatbotSettings,
  chatWithBot
} from "../controllers/chatbotController.js";

const router = express.Router();

router.post("/save", saveChatbotSettings);
router.get("/:userId", getChatbotSettings);

// ⭐ MAIN CHAT ENDPOINT
router.post("/chat", chatWithBot);

export default router;
