import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/UserRoutes.js";
import webhookRoutes from "./routes/webhook.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import embedRoutes from "./routes/embed.js";
import proxyRoute from "./routes/proxy.js";
import qaRoutes from "./routes/qaRoutes.js";
import personaRoutes from "./routes/personaRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

/* ======================================================
   🔥 PERFECT CORS CONFIG (VERCEL + LOCAL + PREVIEW)
====================================================== */

const allowedOrigins = [
  "http://localhost:3000",
  "https://chatbot-frontend-mocha-six.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow server-to-server, Postman, curl
      if (!origin) return callback(null, true);

      // allow known origins
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ REQUIRED for preflight requests
app.options("*", cors());

/* ======================================================
                 MIDDLEWARES
====================================================== */

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

/* Allow iframe embedding (optional) */
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "ALLOWALL");
  next();
});

/* ======================================================
                  DATABASE
====================================================== */

connectDB();

/* ======================================================
                   ROUTES
====================================================== */

app.get("/", (req, res) => {
  res.send("🚀 Chatbot Backend running");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/webhook", webhookRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/embed", embedRoutes);
app.use("/proxy", proxyRoute);
app.use("/api/qa", qaRoutes);
app.use("/api/persona", personaRoutes);
app.use("/api/pdf", pdfRoutes);

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

/* ======================================================
                   START SERVER
====================================================== */

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
