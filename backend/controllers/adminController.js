import mongoose from "mongoose";
import ChatLead from "../models/ChatLead.js";

/* ======================================
   GET CUSTOMERS (FROM ChatLead)
====================================== */
export const getAdminCustomers = async (req, res) => {
  try {
    const { userId } = req.params;

    const doc = await ChatLead.findOne({ userId });

    if (!doc) return res.json([]);

    const customers = doc.leads.map(l => ({
      leadId: l._id,
      name: l.name,
      email: l.email
    }));

    res.json(customers);

  } catch (err) {
    console.error("❌ Admin customers error", err);
    res.status(500).json({ error: "Failed to load customers" });
  }
};


/* ======================================
   GET CHAT (DIRECT FROM MONGO COLLECTION)
====================================== */
export const getAdminChat = async (req, res) => {
  try {
    const { userId, leadId } = req.query;

    // 👇 DIRECT access to "chats" collection
    const chatsCollection = mongoose.connection.collection("chats");

    const chatDoc = await chatsCollection.findOne({
      userId,
      leadId
    });

    if (!chatDoc) {
      return res.json({ messages: [] });
    }

    res.json({
      messages: chatDoc.messages || []
    });

  } catch (err) {
    console.error("❌ Admin chat error", err);
    res.status(500).json({ error: "Failed to load chat" });
  }
};


/* ======================================
   DASHBOARD COUNTS (ONLY COUNT)
====================================== */
export const getDashboardCounts = async (req, res) => {
  try {
    const { userId } = req.query;

    const chatsCollection = mongoose.connection.collection("chats");

    // ALL chats
    const totalChats = await chatsCollection.countDocuments({ userId });

    // TODAY chats
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todayChats = await chatsCollection.countDocuments({
      userId,
      createdAt: { $gte: startOfToday }
    });

    res.json({
      visitors: totalChats,
      chats: totalChats,
      todayChats,
      totalChats
    });

  } catch (err) {
    console.error("❌ Dashboard count error", err);
    res.status(500).json({ error: "Failed to load dashboard counts" });
  }
};


/* ======================================
   FILTERED CUSTOMERS BY DATE
====================================== */
export const getFilteredCustomers = async (req, res) => {
  try {
    const { userId } = req.params;
    const { range } = req.query;

    const chatsCollection = mongoose.connection.collection("chats");

    let filter = { userId };
    const now = new Date();

    if (range === "today") {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      filter.createdAt = { $gte: start };
    }

    if (range === "7days") {
      filter.createdAt = {
        $gte: new Date(now - 7 * 24 * 60 * 60 * 1000),
      };
    }

    if (range === "30days") {
      filter.createdAt = {
        $gte: new Date(now - 30 * 24 * 60 * 60 * 1000),
      };
    }

    const chats = await chatsCollection
      .find(filter)
      .project({ leadId: 1 })
      .toArray();

    // unique customers
    const unique = [...new Set(chats.map(c => c.leadId))];

    res.json(unique.map(id => ({ leadId: id })));

  } catch (err) {
    console.error("❌ Filter customers error", err);
    res.status(500).json({ error: "Failed to filter customers" });
  }
};

