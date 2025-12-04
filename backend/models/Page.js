import mongoose from "mongoose";

const pageSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  siteName: { type: String, required: true },   // ⭐ IMPORTANT
  url: { type: String, required: true },
  lastModified: String,
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Page", pageSchema);
