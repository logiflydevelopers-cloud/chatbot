import fetch from "node-fetch";
import AIPersona from "../models/AIPersona.js";

/* =========================
   SAVE / UPDATE PERSONA
========================= */
export const savePersona = async (req, res) => {
  try {
    const { userId, persona, pythonApiKey } = req.body;

    if (!userId || !persona || !pythonApiKey) {
      return res.status(400).json({
        success: false,
        message: "Missing userId, persona or pythonApiKey",
      });
    }

    /* =========================
       1️⃣ SAVE TO DB
    ========================= */
    const savedPersona = await AIPersona.findOneAndUpdate(
      { userId },
      {
        userId,
        ...persona,
        pythonApiKey,
      },
      { upsert: true, new: true }
    );

    /* =========================
       2️⃣ SEND TO PYTHON API
    ========================= */
    const PYTHON_API_URL =
      "https://ai-persona-api.onrender.com/v1/chat";

    const pythonPayload = {
      userId: savedPersona.userId,
      agentRole: savedPersona.agentRole,
      tone: savedPersona.tone,
      responseLength: savedPersona.responseLength,
    };

    console.log("🐍 Python payload:", pythonPayload);

    await fetch(PYTHON_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${savedPersona.pythonApiKey}`, // ✅ USER KEY
      },
      body: JSON.stringify(pythonPayload),
    });

    return res.json({
      success: true,
      persona: savedPersona,
    });
  } catch (err) {
    console.error("❌ Save persona error:", err);
    res.status(500).json({ success: false });
  }
};

/* =========================
   GET PERSONA
========================= */
export const getPersona = async (req, res) => {
  try {
    const { userId } = req.params;

    const persona = await AIPersona.findOne({ userId });

    return res.json({
      success: true,
      persona: persona || null,
    });
  } catch (err) {
    console.error("❌ Get persona error:", err);
    res.status(500).json({ success: false });
  }
};
