import multer from "multer";
import path from "path";
import fs from "fs";

/* ======================================================
   SAFE UPLOAD DIRECTORY (ABSOLUTE PATH)
====================================================== */

const uploadDir = path.join(process.cwd(), "uploads", "avatars");

// ✅ ENSURE FOLDER EXISTS (VERCEL SAFE)
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
   EXPORT UPLOAD MIDDLEWARE
====================================================== */

export const avatarUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
