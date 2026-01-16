import multer from "multer";
import path from "path";
import fs from "fs";

/* ======================================================
   ✅ VERCEL SAFE WRITABLE DIRECTORY
====================================================== */

// ONLY writable directory on Vercel
const uploadDir = path.join("/tmp", "uploads", "avatars");

// Ensure folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* ======================================================
   MULTER STORAGE
====================================================== */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${Date.now()}${ext}`);
  },
});

/* ======================================================
   FILE FILTER
====================================================== */

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files allowed"), false);
  }
};

/* ======================================================
   EXPORT
====================================================== */

export const avatarUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
