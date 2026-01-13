import express from "express";
import axios from "axios";
import ChatbotSetting from "../models/ChatbotSetting.js";

const router = express.Router();

/* ======================================================
   INGEST WEBSITE → DB + PYTHON API
   ====================================================== */

router.post("/ingest-website", async (req, res) => {
  console.log("🚀 /ingest-website HIT");

  try {
    const { userId, source } = req.body;

    /* ---------- BASIC VALIDATION ---------- */
    if (!userId || !source) {
      return res.status(400).json({
        message: "userId or source missing"
      });
    }

    /* ---------- BLOCK SECOND UPLOAD ---------- */
    const existing = await ChatbotSetting.findOne({ userId });

    if (existing?.website) {
      return res.status(403).json({
        message: "Website already uploaded. Remove from DB to upload again."
      });
    }

    /* ---------- SAVE TO DATABASE ---------- */
    const saved = await ChatbotSetting.findOneAndUpdate(
      { userId },
      { website: source },
      { upsert: true, new: true }
    );

    console.log("✅ Saved to DB:", {
      userId: saved.userId,
      website: saved.website
    });

    /* ---------- PYTHON API CALL ---------- */
    try {
      console.log("➡️ Calling Python API...");

      const pyResponse = await axios.post(
        "https://pinecone-store-api.onrender.com/v1/ingest",
        { userId, source },
        {
          timeout: 30000,
          headers: { "Content-Type": "application/json" }
        }
      );

      console.log("✅ Python API SUCCESS:", pyResponse.data);

    } catch (pyErr) {
      console.error("❌ PYTHON API FAILED:", pyErr.message);
    }

    /* ---------- RESPONSE ---------- */
    res.json({
      success: true,
      message: "Website uploaded. Training started."
    });

  } catch (err) {
    console.error("🔥 SERVER ERROR:", err);
    res.status(500).json({
      message: "Website ingest failed"
    });
  }
});

export default router;
