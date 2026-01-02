import fetch from "node-fetch";
import ChatbotSetting from "../models/ChatbotSetting.js";

console.log("🔥🔥🔥 NEW PYTHON FORWARD CONTROLLER LOADED 🔥🔥🔥");

/* ============================================================
    ⭐ SAVE / UPDATE CHATBOT SETTINGS
============================================================ */
export const saveChatbotSettings = async (req, res) => {
  try {
    const {
      userId,
      avatar,
      firstMessage,
      primaryColor,
      alignment,
      website
    } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const safeWebsite = website || null;

    let setting = await ChatbotSetting.findOne({ userId });

    if (!setting) {
      setting = new ChatbotSetting({
        userId,
        avatar,
        firstMessage,
        primaryColor,
        alignment,
        website: safeWebsite
      });
    } else {
      setting.avatar = avatar;
      setting.firstMessage = firstMessage;
      setting.primaryColor = primaryColor;
      setting.alignment = alignment;
      setting.website = safeWebsite;
    }

    await setting.save();

    return res.json({ success: true, settings: setting });

  } catch (err) {
    console.error("❌ Save settings error →", err);
    res.status(500).json({ error: "Failed to save settings" });
  }
};


/* ============================================================
    ⭐ GET CHATBOT SETTINGS
============================================================ */
export const getChatbotSettings = async (req, res) => {
  try {
    const { userId } = req.params;

    const settings = await ChatbotSetting.findOne({ userId });

    return res.json({ success: true, settings });

  } catch (err) {
    console.error("❌ Get settings error →", err);
    res.status(500).json({ error: "Failed to load settings" });
  }
};


/* ============================================================
    ⭐ MAIN CHAT FUNCTION — PYTHON API FORWARD
============================================================ */
/* ============================================================
   ⭐ MAIN CHAT FUNCTION — FORWARD TO PYTHON API
============================================================ */
export const chatWithBot = async (req, res) => {
  try {
    const { question, userId } = req.body;

    console.log("🟢 [NODE] Question:", question);
    console.log("👤 [NODE] UserId:", userId);

    if (!question || !userId) {
      return res.status(400).json({
        error: "question and userId both required",
      });
    }

    // ✅ REAL PYTHON API
    const PYTHON_API_URL =
      "https://ai-persona-api.onrender.com/v1/chat";

    console.log("🟡 [NODE] Sending to Python API...");

    const response = await fetch(PYTHON_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        question,
      }),
    });

    const data = await response.json();

    console.log("🟣 [NODE] Python response:", data);

    return res.json({
      success: true,
      answer: data.answer || "No response from AI",
    });

  } catch (err) {
    console.error("❌ [NODE] Chat error:", err);
    res.status(500).json({ error: "Chat failed" });
  }
};

