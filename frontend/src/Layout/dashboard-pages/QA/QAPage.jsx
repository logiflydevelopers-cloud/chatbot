import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./QAPage.css";
import { getUserQAs, deleteQA } from "./qaService";

const QAPage = () => {
  const navigate = useNavigate();
  const [qas, setQas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Read user from localStorage
  const getUserId = () => {
    try {
      const u = JSON.parse(localStorage.getItem("user"));
      return u?._id || u?.id || u?.userId || null;
    } catch {
      return null;
    }
  };

  const fetchQAs = useCallback(async () => {
    setLoading(true);
    setError("");

    const userId = getUserId();
    if (!userId) {
      setError("Please login again.");
      setLoading(false);
      return;
    }

    try {
      const data = await getUserQAs(userId);
      setQas(data);

      // ⭐ FIXED KNOWLEDGE FLAG
      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem("hasQA", "true");
      } else {
        localStorage.removeItem("hasQA");
      }

    } catch (err) {
      console.error(err);
      setError("Failed to load Q&A");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQAs();
  }, [fetchQAs]);

  const handleEdit = (id) => navigate(`/dashboard/knowledge/qa/edit/${id}`);
  const handleNew = () => navigate("/dashboard/knowledge/qa/new");

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this Q&A?")) return;

    try {
      await deleteQA(id);

      const newQas = qas.filter((q) => q._id !== id);
      setQas(newQas);

      // ⭐ FIX — remove hasQA only when list empty
      if (newQas.length === 0) {
        localStorage.removeItem("hasQA");
      }

    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="qa-wrapper">

      <button className="qa-back-btn" onClick={() => navigate("/dashboard/knowledge")}>
        ←
      </button>

      <div className="qa-header">
        <h2>QUESTIONS & ANSWER</h2>
        <p>Provide question-answer pairs your agent can use</p>
      </div>

      <div className="qa-actions">
        <button className="qa-add-btn" onClick={handleNew}>
          + Add new knowledge
        </button>
      </div>

      {loading && <div className="qa-loading">Loading...</div>}
      {error && <div className="qa-error">{error}</div>}

      <div className="qa-list">
        {qas.length === 0 && !loading && (
          <div className="qa-empty">
            No Q&A yet. Click "Add new knowledge" to create one.
          </div>
        )}

        {qas.map((q) => (
          <div className="qa-card" key={q._id}>
            <div className="qa-card-left">
              <div className="qa-icon">❓</div>
            </div>

            <div className="qa-card-middle">
              <div className="qa-question">{q.question}</div>
              <div className="qa-answer">{q.answer}</div>
              <div className="qa-date">
                Agent learned on {new Date(q.createdAt).toLocaleString()}
              </div>
            </div>

            <div className="qa-card-right">
              <button className="qa-edit" onClick={() => handleEdit(q._id)}>Edit</button>
              <button className="qa-delete" onClick={() => handleDelete(q._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QAPage;
