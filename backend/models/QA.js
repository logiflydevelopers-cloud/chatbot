import mongoose from "mongoose";

const qaItemSchema = new mongoose.Schema(
  {
    _id: { type: String }, 
    label: { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const qaSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true   // 🔥 ONLY ONE DOCUMENT PER USER
  },
  items: [qaItemSchema]
});

export default mongoose.model("QA", qaSchema);
