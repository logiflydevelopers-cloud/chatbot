import express from "express";
import {
  createQA,
  getQAsByUser,
  getQA,
  updateQA,
  deleteQA
} from "../controllers/qaController.js";

const router = express.Router();

router.post("/", createQA);
router.get("/all/:userId", getQAsByUser);   // ⭐ MUST EXIST
router.get("/user/:userId", getQAsByUser);
router.get("/:id", getQA);
router.put("/:id", updateQA);
router.delete("/:id", deleteQA);

export default router;
