import multer from "multer";
import path from "path";
import fs from "fs";

/* ======================================================
   UPLOAD DIRECTORY SETUP
====================================================== */

// projectRoot/uploads/avatars
const uploadDir = path.join(process.cwd(), "uploads", "avatars");

// Ensure folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* ======================================================
   MULTER STORAGE CONFIG
====================================================== */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `avatar-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

/* ======================================================
   FILE FILTER
====================================================== */

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

/* ======================================================
   EXPORT MULTER
====================================================== */

export const avatarUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
