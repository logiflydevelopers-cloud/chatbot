// backend/controllers/chatbotController.js

import { getEmbedding, askOpenAIWithContext } from "../utils/openai.js";
import { queryVectors } from "../utils/pinecone.js";
import ChatbotSetting from "../models/ChatbotSetting.js";


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
      website    // ⭐ MUST be received
    } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    if (!website) {
      return res
        .status(400)
        .json({ error: "Website missing. Upload a website first." });
    }

    let setting = await ChatbotSetting.findOne({ userId });

    if (!setting) {
      // CREATE NEW
      setting = new ChatbotSetting({
        userId,
        avatar,
        firstMessage,
        primaryColor,
        alignment,
        website     // ⭐ STORE WEBSITE
      });
    } else {
      // UPDATE EXISTING
      setting.avatar = avatar;
      setting.firstMessage = firstMessage;
      setting.primaryColor = primaryColor;
      setting.alignment = alignment;
      setting.website = website;  // ⭐ ENSURE THIS IS SAVED
    }

    await setting.save();

    res.json({
      success: true,
      message: "Settings saved successfully",
      settings: setting
    });

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

    if (!settings) {
      return res.json({
        success: true,
        settings: null
      });
    }

    res.json({ success: true, settings });

  } catch (err) {
    console.error("❌ Get settings error →", err);
    res.status(500).json({ error: "Failed to load settings" });
  }
};


/* ============================================================
    ⭐ MAIN CHAT FUNCTION — Pinecone + OpenAI
============================================================ */
export const chatWithBot = async (req, res) => {
  try {
    const { userId, question } = req.body;

    console.log("\n===============================");
    console.log("📥 CHAT REQUEST");
    console.log("User ID:", userId);
    console.log("Question:", question);
    console.log("===============================\n");

    if (!userId || !question) {
      return res.status(400).json({ error: "Missing userId/question" });
    }

    // 1️⃣ Create embedding
    const qEmbedding = await getEmbedding(question);
    console.log("🔹 Embedding created, length:", qEmbedding.length);

    // 2️⃣ Query Pinecone namespace = userId
    const matches = await queryVectors(qEmbedding, userId, 5);
    console.log("🔍 Matches found:", matches.length);

    // 3️⃣ Build context from matched documents
    const context = matches
      .map(m => m.metadata?.text || "")
      .join("\n\n---\n\n");

    console.log("\n🧠 CONTEXT SENT TO OPENAI:");
    console.log(context.slice(0, 600), "...");
    console.log("\n");

    // 4️⃣ Ask OpenAI
    const answer = await askOpenAIWithContext(question, context);

    console.log("🤖 FINAL ANSWER FROM OPENAI:");
    console.log(answer);
    console.log("===============================\n");

    res.json({
      success: true,
      answer,
      contextPreview: context.slice(0, 300),
      pineconeMatches: matches.length,
    });

  } catch (err) {
    console.error("❌ Chat error →", err);
    res.status(500).json({ error: "Chat failed" });
  }
};
