import mongoose from "mongoose";

const AIPersonaSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    agentName: String,
    agentRole: String,
    language: String,
    tone: String,
    responseLength: Number,

    guidelines: {
      type: [String],
      default: [],
    },

    // ✅ USER PYTHON API KEY
    pythonApiKey: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("AIPersona", AIPersonaSchema);
