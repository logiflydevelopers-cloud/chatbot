import fetch from "node-fetch";
import AIPersona from "../models/AIPersona.js";


const RESPONSE_LENGTH_MAP = {
  25: "Minimal",
  50: "Short",
  75: "Long",
  100: "Chatty",
};


/* =========================
   SAVE / UPDATE PERSONA
========================= */
export const savePersona = async (req, res) => {
  try {
    console.log("📥 Incoming body:", req.body);

    const { userId, persona } = req.body;

    if (!userId || !persona) {
      return res.status(400).json({
        success: false,
        message: "Missing userId or persona",
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
      },
      { upsert: true, new: true }
    );

    console.log("✅ Saved Persona in DB:", savedPersona);

    /* =========================
       2️⃣ SEND TO PYTHON API (ALWAYS)
    ========================= */
    const PYTHON_API_URL =
      "https://ai-persona-api.onrender.com/v1/chat";

    const pythonPayload = {
      userId: savedPersona.userId,
      settings: {
        role: savedPersona.agentRole,
        tone: savedPersona.tone,
        length:
          RESPONSE_LENGTH_MAP[savedPersona.responseLength] || "Short",
      },
    };

    console.log("🐍 Python payload:", pythonPayload);


    await fetch(PYTHON_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pythonPayload),
    });

    return res.json({
      success: true,
      persona: savedPersona,
    });
  } catch (err) {
    console.error("❌ Save persona error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =========================
   GET PERSONA
========================= */
export const getPersona = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log("🔍 Fetch persona for userId:", userId);

    const persona = await AIPersona.findOne({ userId });

    return res.json({
      success: true,
      persona: persona || null,
    });
  } catch (err) {
    console.error("❌ Get persona error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
