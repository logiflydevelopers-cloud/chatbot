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
export const chatWithBot = async (req, res) => {
  try {
    const { question, userId } = req.body;

    const response = await fetch(
      "https://ai-persona-api.onrender.com/v1/chat",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, question }),
      }
    );

    const rawText = await response.text();
    console.log("🐍 Python raw:", rawText);

    const data = JSON.parse(rawText);

    const answer =
      data.answer ||
      data.response ||
      data.message ||
      "AI did not return a reply";

    return res.json({ success: true, answer });
  } catch (err) {
    console.error("❌ Chat error:", err);
    res.status(500).json({ success: false, answer: "Server error" });
  }
};


