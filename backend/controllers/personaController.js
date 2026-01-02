import fetch from "node-fetch";
import AIPersona from "../models/AIPersona.js";

/* =========================
   SAVE / UPDATE PERSONA
========================= */
export const savePersona = async (req, res) => {
  try {
    const { userId, persona } = req.body;

    if (!userId || !persona) {
      return res.status(400).json({ success: false });
    }

    /* =========================
       1️⃣ SAVE FULL PERSONA TO DB
    ========================= */
    const savedPersona = await AIPersona.findOneAndUpdate(
      { userId },
      { userId, ...persona },
      { upsert: true, new: true }
    );

    /* =========================
       2️⃣ SEND ONLY REQUIRED DATA TO PYTHON
    ========================= */
    const PYTHON_API_URL = "https://chatbot-backend-project.vercel.app/persona";

    const pythonPayload = {
      userId: savedPersona.userId,
      agentRole: savedPersona.agentRole,
      tone: savedPersona.tone,
      responseLength: savedPersona.responseLength,
    };

    console.log("🐍 Sending to Python:", pythonPayload);

    await fetch(PYTHON_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pythonPayload),
    });

    /* =========================
       3️⃣ RETURN RESPONSE TO FRONTEND
    ========================= */
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
   GET PERSONA (LOAD)
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
