import mongoose from "mongoose";

const AIPersonaSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    agentName: {
      type: String,
      required: true,
      default: "Ella",
    },
    agentRole: String,
    language: String,
    tone: String,
    responseLength: Number,

  },
  { timestamps: true }
);

export default mongoose.model("AIPersona", AIPersonaSchema);
