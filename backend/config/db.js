import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB Connected");

    // 🔥 PERMANENT FIX: remove old wrong index
    const db = mongoose.connection.db;

    const collections = await db
      .listCollections({ name: "chatleads" })
      .toArray();

    if (collections.length > 0) {
      const indexes = await db.collection("chatleads").indexes();

      const badIndex = indexes.find(i => i.name === "chatUserId_1");

      if (badIndex) {
        await db.collection("chatleads").dropIndex("chatUserId_1");
        console.log("🔥 Removed old index: chatUserId_1");
      }
    }

  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
