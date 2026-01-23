import express from "express";
import nodemailer from "nodemailer";
import multer from "multer";

const router = express.Router();

/* ======================================================
   MULTER (MEMORY STORAGE — VERCEL SAFE)
====================================================== */

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

/* ======================================================
   ROUTE
====================================================== */

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { name, email, subject, message, link } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"SellChats Support" <${process.env.ADMIN_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `Support Ticket: ${subject}`,
      html: `
        <h2>New Support Ticket</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Link:</b> ${link || "-"}</p>
        <p><b>Message:</b></p>
        <p>${message}</p>
      `,
      attachments: req.file
        ? [
            {
              filename: req.file.originalname,
              content: req.file.buffer, // 👈 NO FILE SYSTEM
            },
          ]
        : [],
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("CONTACT ERROR:", err);
    res.status(500).json({ success: false });
  }
});

export default router;
