import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    avatar: String,
    firstMessage: String,
    primaryColor: String,
    alignment: String,
    website: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("ChatbotSetting", settingsSchema);
