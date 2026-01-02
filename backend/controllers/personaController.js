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

    const savedPersona = await AIPersona.findOneAndUpdate(
      { userId },
      { userId, ...persona },
      { upsert: true, new: true }
    );

    // Forward to Python
    const PYTHON_API_URL = "http://192.168.1.50:8000/persona";

    await fetch(PYTHON_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, persona: savedPersona }),
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
