import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import { generateAccessToken, generateRefreshToken } from "../token.js";
import { loginUser, registerUser } from "../controllers/UserController.js";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* ================= NORMAL AUTH ================= */
router.post("/register", registerUser);
router.post("/login", loginUser);

/* ================= GOOGLE LOGIN ================= */

// STEP 1: Send Google URL
router.get("/google", (req, res) => {
  const url = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["profile", "email"],
    redirect_uri: process.env.GOOGLE_REDIRECT,
  });

  res.json({ url });
});

// STEP 2: Google Callback
router.get("/google/callback", async (req, res) => {
  try {
    const { code } = req.query;

    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT,
        grant_type: "authorization_code",
      }
    );

    const { id_token } = tokenRes.data;

    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = await User.create({
        name: payload.name,
        email: payload.email,
        avatar: payload.picture,
        password: "google-user",
      });
    }

    // 🔥 SAME TOKEN LOGIC AS NORMAL LOGIN
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 🔥 REDIRECT TO FRONTEND
    res.redirect(
      `${process.env.FRONTEND_URL}/google-success?token=${accessToken}`
    );
  } catch (err) {
    console.error(err);
    res.redirect(`${process.env.FRONTEND_URL}/login`);
  }
});

export default router;
