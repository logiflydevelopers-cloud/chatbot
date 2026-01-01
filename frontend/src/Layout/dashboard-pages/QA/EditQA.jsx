import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditQA.css";
import { createQA, getQAById, updateQA } from "./qaService";
import "../train-page.css";

const EditQA = () => {
  const { id } = useParams(); // id is optional (for edit)
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const getUserId = () => {
    try {
      const u = JSON.parse(localStorage.getItem("user"));
      return u?._id || u?.id || u?.userId || null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const doc = await getQAById(id);
        setQuestion(doc.question);
        setAnswer(doc.answer);
      } catch (err) {
        console.error(err);
        setError("Failed to load Q&A");
      }
    })();
  }, [id]);

  const handleSave = async () => {
    setError("");
    if (!question.trim() || !answer.trim()) {
      setError("Both question and answer are required.");
      return;
    }

    const userId = getUserId();
    if (!userId) {
      setError("Please login again.");
      return;
    }

    setSaving(true);
    try {
      if (id) {
        await updateQA(id, { question, answer });
      } else {
        await createQA({ question, answer, userId });
      }
      navigate("/dashboard/knowledge/qa");
    } catch (err) {
      console.error(err);
      setError("Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="persona-container">
      <div className="editqa-header">
        <button className="fu-back-btn" onClick={() => navigate(-1)}>←</button>
        <h2>{id ? "Edit Q&A" : "Add Q&A"}</h2>
      </div>

      <div className="editqa-form">
        {error && <div className="editqa-error">{error}</div>}

        <label>Question</label>
        <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Enter a brief, clear question" />

        <label>Answer</label>
        <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Provide the answer the agent should use" rows={8} />

        <div className="editqa-actions">
          <button className="editqa-save" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
          <button className="editqa-cancel" onClick={() => navigate("/dashboard/knowledge/qa")}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditQA;
