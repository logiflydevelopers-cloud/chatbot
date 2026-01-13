import QA from "../models/QA.js";
import { v4 as uuidv4 } from "uuid";

/* CREATE QA */
export const createQA = async (req, res) => {
  try {
    const { userId, question, answer, label } = req.body;
    if (!userId || !question || !answer || !label) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const qaId = "qa_" + uuidv4();

    let doc = await QA.findOne({ userId });

    if (!doc) {
      doc = await QA.create({
        userId,
        items: []
      });
    }

    doc.items.push({
      _id: qaId,
      label,
      question,
      answer,
      createdAt: new Date()
    });

    await doc.save();

    res.status(201).json({
      success: true,
      _id: qaId,
      question,
      answer
    });

  } catch (err) {
    console.error("QA create error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/* GET ALL QAs BY USER */
export const getQAsByUser = async (req, res) => {
  try {
    const doc = await QA.findOne({ userId: req.params.userId });
    res.json(doc?.items || []);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

/* GET SINGLE QA */
export const getQA = async (req, res) => {
  const doc = await QA.findOne({ "items._id": req.params.id });
  if (!doc) return res.status(404).json({ error: "Not found" });

  res.json(doc.items.find(q => q._id === req.params.id));
};

/* UPDATE QA */
export const updateQA = async (req, res) => {
  const doc = await QA.findOne({ "items._id": req.params.id });
  if (!doc) return res.status(404).json({ error: "Not found" });

  const qa = doc.items.find(q => q._id === req.params.id);

  if (req.body.label !== undefined) qa.label = req.body.label;
  if (req.body.question !== undefined) qa.question = req.body.question;
  if (req.body.answer !== undefined) qa.answer = req.body.answer;

  await doc.save();
  res.json(qa);
};


/* DELETE QA */
export const deleteQA = async (req, res) => {
  await QA.findOneAndUpdate(
    { "items._id": req.params.id },
    { $pull: { items: { _id: req.params.id } } }
  );
  res.json({ success: true });
};


// GET UNIQUE LABELS + ANSWERS
export const getQALabels = async (req, res) => {
  const doc = await QA.findOne({ userId: req.params.userId });
  if (!doc) return res.json([]);

  res.json(
    doc.items.map(i => ({
      label: i.label,
      question: i.question,
      answer: i.answer
    }))
  );
};

