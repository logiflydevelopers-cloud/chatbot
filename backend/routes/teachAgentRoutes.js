import express from "express";
import { teachAgentChat, restartAgentChat } from "../controllers/teachAgentController.js";

const router = express.Router();

router.post("/chat", teachAgentChat);
router.post("/restart", restartAgentChat);

export default router;
