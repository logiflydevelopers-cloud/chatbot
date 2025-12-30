import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";

import User from "../models/User.js";
import { registerUser, loginUser } from "../controllers/UserController.js";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ==============================
// TEMP OTP STORE
// ==============================
let otpStore = {};

// ==============================
// HELPERS
// ==============================
const BACKEND_CALLBACK =
  process.env.NODE_ENV === "production"
    ? "https://chatbot-backend-project.vercel.app/api/auth/google/callback"
    : "http://localhost:4000/api/auth/google/callback";

const FRONTEND_URL =
  process.env.NODE_ENV === "production"
    ? "https://chatbot-frontend-mocha-six.vercel.app"
    : "http://localhost:3000";

/* ============================================================
   NORMAL LOGIN & REGISTER
============================================================ */
router.post("/register", registerUser);
router.post("/login", loginUser);

/* ============================================================
   FORGOT PASSWORD - SEND OTP
============================================================ */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = otp;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is: ${otp}`,
    });

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

/* ============================================================
   VERIFY OTP
============================================================ */
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] && otpStore[email] == otp) {
    return res.json({ success: true });
  }

  return res.status(400).json({ message: "Invalid OTP" });
});

/* ============================================================
   RESET PASSWORD
============================================================ */
router.post("/reset-password", async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updateOne({ email }, { password: hashedPassword });

    delete otpStore[email];
    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Error resetting password" });
  }
});

/* ============================================================
   GOOGLE LOGIN - STEP 1 (Generate URL)
============================================================ */
router.get("/google", (req, res) => {
  try {
    const url = client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
      ],
      redirect_uri: BACKEND_CALLBACK, // ✅ FIXED
    });

    res.json({ url });
  } catch (err) {
    res.status(500).json({ message: "Failed to create Google login URL" });
  }
});

/* ============================================================
   GOOGLE LOGIN - STEP 2 (Callback)
============================================================ */
router.get("/google/callback", async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).json({ message: "No code provided" });

    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: BACKEND_CALLBACK, // ✅ FIXED
        grant_type: "authorization_code",
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const { id_token } = tokenResponse.data;

    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const googleUser = ticket.getPayload();

    let user = await User.findOne({ email: googleUser.email });
    if (!user) {
      user = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        avatar: googleUser.picture,
        password: "google-user",
      });
    }

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    return res.redirect(
      `${FRONTEND_URL}/google-success?token=${accessToken}&user=${encodeURIComponent(
        JSON.stringify(safeUser)
      )}`
    );
  } catch (err) {
    console.error("❌ Google Login Error:", err);
    res.status(500).json({ message: "Google login failed" });
  }
});

export default router;
