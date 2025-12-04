import mongoose from "mongoose";

const QASchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("QA", QASchema);
