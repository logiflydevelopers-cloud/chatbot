import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },

  phone: {
    type: String,
    default: "",
  },

  avatar: {
    type: String,
    default: null,
  },
}, { timestamps: true });

export default mongoose.model("UserData", userSchema)
