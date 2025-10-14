import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoute from './routes/UserRoutes.js';
import authRoutes from "./routes/auth.js";


const app = express();
const PORT = process.env.PORT || 3001;

// ✅ Connect to database
await connectDB();

// ✅ Define allowed origins (local + Vercel frontend)
const allowedOrigins = [
  "http://localhost:3000",
  "https://admin-chatbot-frontend.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// ✅ Test route
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

// ✅ Routes
app.use("/api/auth", authRoute);
app.use("/api/auth", authRoutes);

// For Vercel serverless, don't use app.listen
export default app;
