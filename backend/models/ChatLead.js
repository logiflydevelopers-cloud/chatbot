import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    _id: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const chatLeadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true
  },
  leads: [leadSchema]
});

export default mongoose.model("ChatLead", chatLeadSchema);
