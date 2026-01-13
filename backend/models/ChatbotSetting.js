  import mongoose from "mongoose";

  const settingsSchema = new mongoose.Schema(
    {
      userId: { type: String, required: true },

      avatar: String,
      firstMessage: String,
      primaryColor: String,
      alignment: String,
      website: { type: String, default: null },

      // ✅ PDF TRAINING FIELDS
      pdfName: { type: String, default: null },
      pdfPath: { type: String, default: null },
      isPdfTrained: { type: Boolean, default: false }

    },
    { timestamps: true }
  );

  export default mongoose.model("ChatbotSetting", settingsSchema);
