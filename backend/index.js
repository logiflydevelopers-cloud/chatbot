import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/UserRoutes.js";
import webhookRoutes from "./routes/webhook.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import embedRoutes from "./routes/embed.js";
import proxyRoute from "./routes/proxy.js";
import qaRoutes from "./routes/qaRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";

dotenv.config();

const app = express();

/* ----------------------------
   ⭐ Detect Local vs Vercel
----------------------------- */
const isVercel = Boolean(process.env.VERCEL);  // <-- Vercel auto sets this
const PORT = process.env.PORT || 4000;

/* ----------------------------
      CORS SETTINGS
----------------------------- */
app.use(
  cors({
    origin: "https://frontend-demo-chatbot.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors({
  origin: "https://frontend-demo-chatbot.vercel.app",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Allow iframe
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "ALLOWALL");
  next();
});

connectDB();

/* ----------------------------
         ROUTES
----------------------------- */
app.get("/", (req, res) => res.send("Chatbot Backend running"));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/webhook", webhookRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/embed", embedRoutes);
app.use("/proxy", proxyRoute);
app.use("/api/qa", qaRoutes);
app.use("/file", fileRoutes);

/* ----------------------------
 ⭐ LOCAL ONLY → Start Server
 ⭐ VERCEL → Do NOT Start Server
----------------------------- */
if (!process.env.VERCEL) {
  app.listen(PORT, () =>
    console.log(`🚀 Local Server running on port ${PORT}`)
  );
}

export default app;

