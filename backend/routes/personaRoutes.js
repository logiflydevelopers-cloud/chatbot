import express from "express";
import {
  savePersona,
  getPersona,
} from "../controllers/personaController.js";

const router = express.Router();

router.post("/save", savePersona);
router.get("/:userId", getPersona);

export default router;
