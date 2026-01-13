import express from "express";
import multer from "multer";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import ChatbotSetting from "../models/ChatbotSetting.js";

const router = express.Router();

console.log("📄 PDF ROUTES LOADED");

/* -------------------- MULTER CONFIG -------------------- */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files allowed"));
    }
    cb(null, true);
  }
});

/* -------------------- GET PDF STATUS -------------------- */
// GET /api/pdf/status/:userId
router.get("/status/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const setting = await ChatbotSetting.findOne({ userId });

    if (!setting?.pdfName) {
      return res.json({ hasPdf: false });
    }

    res.json({
      hasPdf: true,
      pdfName: setting.pdfName
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch PDF status" });
  }
});

/* -------------------- PDF UPLOAD -------------------- */
// POST /api/pdf/upload
router.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId missing" });
    }

    // 🔒 BLOCK SECOND UPLOAD
    const existing = await ChatbotSetting.findOne({ userId });
    if (existing?.pdfName) {
      return res.status(403).json({
        message: "PDF already uploaded. Remove existing PDF to upload again."
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: "PDF file missing" });
    }

    // ✅ Save to DB
    const updatedSetting = await ChatbotSetting.findOneAndUpdate(
      { userId },
      {
        pdfName: req.file.originalname,
        pdfPath: req.file.path,
        isPdfTrained: false
      },
      { new: true, upsert: true }
    );

    // 🔁 Python API (fire & forget)
    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path));
    formData.append("userId", userId);

    axios.post(
      "https://pinecone-store-api.onrender.com/v1/ingest/pdf",
      formData,
      { headers: formData.getHeaders() }
    )
    .then(() => {
      console.log("📤 PDF sent to Python API");
    })
    .catch((err) => {
      console.error("❌ Python API error:", err.message);
    });

    res.json({
      success: true,
      message: "PDF uploaded successfully",
      data: {
        pdfName: updatedSetting.pdfName
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "PDF upload failed" });
  }
});

export default router;
