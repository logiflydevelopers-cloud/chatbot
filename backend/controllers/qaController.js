import QA from "../models/QA.js";

// CREATE
export const createQA = async (req, res) => {
  try {
    const { userId, question, answer } = req.body;

    if (!userId || !question || !answer) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const doc = await QA.create({ userId, question, answer });
    res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// READ ALL BY USER
export const getQAsByUser = async (req, res) => {
  try {
    const docs = await QA.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// READ SINGLE
export const getQA = async (req, res) => {
  try {
    const doc = await QA.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE
export const updateQA = async (req, res) => {
  try {
    const { question, answer } = req.body;

    const doc = await QA.findByIdAndUpdate(
      req.params.id,
      { question, answer },
      { new: true }
    );

    if (!doc) return res.status(404).json({ error: "Not found" });

    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE
export const deleteQA = async (req, res) => {
  try {
    const doc = await QA.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
