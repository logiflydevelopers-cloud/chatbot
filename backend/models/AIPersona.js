import mongoose from "mongoose";

const AIPersonaSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
      unique: true, // 1 user = 1 persona
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
  },
  { timestamps: true }
);

export default mongoose.model("AIPersona", AIPersonaSchema);
