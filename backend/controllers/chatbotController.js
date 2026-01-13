import fetch from "node-fetch";
import ChatbotSetting from "../models/ChatbotSetting.js";
import ChatLead from "../models/ChatLead.js";          // ✅ NEW
import { v4 as uuidv4 } from "uuid";                   // ✅ NEW

/* ============================================================
   ⭐ SAVE / UPDATE CHATBOT SETTINGS (SAFE)
============================================================ */
export const saveChatbotSettings = async (req, res) => {
  try {
    const {
      userId,
      avatar,
      firstMessage,
      primaryColor,
      alignment
    } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    let setting = await ChatbotSetting.findOne({ userId });

    if (!setting) {
      setting = new ChatbotSetting({
        userId,
        avatar,
        firstMessage,
        primaryColor,
        alignment
      });
    } else {
      if (avatar !== undefined) setting.avatar = avatar;
      if (firstMessage !== undefined) setting.firstMessage = firstMessage;
      if (primaryColor !== undefined) setting.primaryColor = primaryColor;
      if (alignment !== undefined) setting.alignment = alignment;
    }

    await setting.save();

    return res.json({
      success: true,
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

    return res.json({
      success: true,
      settings
    });

  } catch (err) {
    console.error("❌ Get settings error →", err);
    res.status(500).json({ error: "Failed to load settings" });
  }
};

/* ============================================================
   ⭐ REGISTER CHAT LEAD (EMAIL CAPTURE)
============================================================ */
export const registerLead = async (req, res) => {
  try {
    const { userId, email } = req.body;

    if (!userId || !email) {
      return res.status(400).json({ error: "userId & email required" });
    }

    const leadId = "lead_" + uuidv4();

    const doc = await ChatLead.findOne({ userId });

    // 🔁 IF DOCUMENT EXISTS
    if (doc) {
      const already = doc.leads.find(l => l.email === email);
      if (already) {
        return res.json({
          success: true,
          chatUserId: already._id,
          name: email.split("@")[0]
        });
      }

      doc.leads.push({
        _id: leadId,
        email,
        createdAt: new Date()
      });

      await doc.save();
    }

    // 🆕 IF FIRST LEAD FOR USER
    else {
      await ChatLead.create({
        userId,
        leads: [
          {
            _id: leadId,
            email,
            createdAt: new Date()
          }
        ]
      });
    }

    return res.json({
      success: true,
      chatUserId: leadId,
      name: email.split("@")[0]
    });

  } catch (err) {
    console.error("❌ Register lead error →", err);
    res.status(500).json({ error: "Failed to save lead" });
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
        body: JSON.stringify({ userId, question })
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
    res.status(500).json({
      success: false,
      answer: "Server error"
    });
  }
};
