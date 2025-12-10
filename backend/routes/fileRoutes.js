import express from "express";
import upload from "../middleware/upload.js";
import { uploadFile, deleteFile } from "../controllers/fileController.js";

const router = express.Router();

router.post("/upload", upload.single("file"), uploadFile);
router.delete("/delete/:fileId", deleteFile);

export default router;
