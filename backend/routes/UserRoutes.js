import express from "express";
import {
  getUserDetails,
  loginUser,
  logout,
  refreshAccessToken,
  registerUser,
} from "../controllers/UserController.js";

import User from "../models/User.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

/* -----------------------------
   AUTH ROUTES
------------------------------ */
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.get("/refresh", refreshAccessToken);

/* ---------------------------------------------------
   FIXED: SINGLE VALID USER DETAILS ROUTE
--------------------------------------------------- */
router.get("/getUser/:userId", authenticate, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.error("Get User Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
});

/* ---------------------------------------------------
   SAVE CHATBOT CUSTOMIZATION SETTINGS
--------------------------------------------------- */
router.post("/save-chat-settings", async (req, res) => {
  try {
    const { userId, avatar, primaryColor, firstMessage, alignment } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID missing!" });
    }

    await User.updateOne(
      { _id: userId },
      {
        $set: {
          "chatbot.avatar": avatar,
          "chatbot.primaryColor": primaryColor,
          "chatbot.firstMessage": firstMessage,
          "chatbot.alignment": alignment,
        },
      }
    );

    return res.json({ success: true, message: "Chatbot settings saved!" });
  } catch (error) {
    console.error("Save settings error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* ---------------------------------------------------
   GET USER CHATBOT SETTINGS
--------------------------------------------------- */
router.get("/get-chatbot-settings/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("chatbot");

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    return res.json(user);
  } catch (error) {
    console.error("Get user settings error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
