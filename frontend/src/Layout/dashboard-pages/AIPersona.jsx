import React, { useState, useEffect } from "react";
import {
  FiMessageSquare,
  FiMic,
  FiMail,
  FiTrash2,
  FiPlus,
  FiArrowLeft,
} from "react-icons/fi";
import { useOutletContext } from "react-router-dom";

import aiIcon from "../../image/AI PERSONA.svg";
import "./AIPersona.css";
import "./train-page.css";

const AIPersona = () => {
  const { setSidebarOpen } = useOutletContext();

  // ======================
  // USER ID
  // ======================
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId =
    storedUser?._id || storedUser?.id || storedUser?.userId || null;

  const [activeTab, setActiveTab] = useState("chat");
  const [isDirty, setIsDirty] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // ======================
  // PERSONA STATE
  // ======================
  const [persona, setPersona] = useState({
    agentName: "Ella",
    agentRole: "Customer Support Agent",
    language: "English",
    tone: "Friendly",
    responseLength: 25,
    guidelines: [
      "Your main goal is to promptly answer questions and resolve issues.",
      "Always provide helpful and clear solutions.",
      "Be polite and empathetic in all interactions.",
      "Maintain professionalism while being approachable and friendly.",
    ],
  });

  // ======================
  // PYTHON API KEY
  // ======================
  const [pythonApiKey, setPythonApiKey] = useState("");

  /* ====================================================
     🔥 LOAD PERSONA FROM DATABASE
  ==================================================== */
  useEffect(() => {
    const loadPersona = async () => {
      if (!userId) return;

      try {
        const res = await fetch(
          `http://localhost:4000/api/persona/${userId}`
        );
        const data = await res.json();

        if (data.success && data.persona) {
          setPersona({
            agentName: data.persona.agentName || "Ella",
            agentRole:
              data.persona.agentRole || "Customer Support Agent",
            language: data.persona.language || "English",
            tone: data.persona.tone || "Friendly",
            responseLength: data.persona.responseLength || 25,
            guidelines:
              data.persona.guidelines?.length > 0
                ? data.persona.guidelines
                : [],
          });

          // ✅ LOAD PYTHON API KEY
          setPythonApiKey(data.persona.pythonApiKey || "");
          setIsDirty(false);
        }
      } catch (err) {
        console.error("❌ Persona load failed:", err);
      }
    };

    loadPersona();
  }, [userId]);

  const markDirty = () => setIsDirty(true);

  // ======================
  // GUIDELINES HANDLERS
  // ======================
  const addGuideline = () => {
    setPersona({
      ...persona,
      guidelines: [...persona.guidelines, ""],
    });
    markDirty();
  };

  const updateGuideline = (i, v) => {
    const updated = persona.guidelines.map((g, idx) =>
      idx === i ? v : g
    );
    setPersona({ ...persona, guidelines: updated });
    markDirty();
  };

  const deleteGuideline = (i) => {
    setPersona({
      ...persona,
      guidelines: persona.guidelines.filter((_, idx) => idx !== i),
    });
    markDirty();
  };

  /* =========================
     💾 SAVE PERSONA
  ========================= */
  const savePersona = async () => {
    try {
      const res = await fetch(
        "http://localhost:4000/api/persona/save",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            persona,
            pythonApiKey, // ✅ SEND KEY
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setIsDirty(false);
        setSaveMessage("✅ Persona saved successfully");
        setTimeout(() => setSaveMessage(""), 3000);
      }
    } catch (err) {
      console.error("❌ Save failed:", err);
    }
  };

  return (
    <div className="persona-container">
      {/* HEADER */}
      <div className="persona-header">
        <button
          className="back-btn"
          onClick={() => setSidebarOpen(true)}
        >
          <FiArrowLeft />
        </button>

        <div className="persona-icon">
          <img src={aiIcon} alt="AI Persona" />
        </div>

        <div>
          <h2>AI PERSONA</h2>
          <p>Write and customize how the AI talks and acts</p>
        </div>
      </div>

      {/* SAVE MESSAGE */}
      {saveMessage && (
        <div className="save-success-message global">
          {saveMessage}
        </div>
      )}

      <div className="persona-card">
        {/* Agent Name */}
        <section className="persona-section">
          <label>Agent Name</label>
          <span>Give a name to your Agent</span>
          <input
            value={persona.agentName}
            onChange={(e) => {
              setPersona({ ...persona, agentName: e.target.value });
              markDirty();
            }}
          />
        </section>
   


        {/* Agent Role */}
        <section className="persona-section">
          <label>Agent Role</label>
          <input
            value={persona.agentRole}
            onChange={(e) => {
              setPersona({ ...persona, agentRole: e.target.value });
              markDirty();
            }}
          />
        </section>

        {/* Conversation Style */}
        <section className="persona-section">
          <label>Conversation Style</label>
          <div className="tabs">
            <button
              className={activeTab === "chat" ? "active" : ""}
              onClick={() => setActiveTab("chat")}
            >
              <FiMessageSquare /> Chat
            </button>
            <button
              className={activeTab === "voice" ? "active" : ""}
              onClick={() => setActiveTab("voice")}
            >
              <FiMic /> Voice
            </button>
            <button
              className={activeTab === "email" ? "active" : ""}
              onClick={() => setActiveTab("email")}
            >
              <FiMail /> Email
            </button>
          </div>
        </section>

        {/* CHAT SETTINGS */}
        {activeTab === "chat" && (
          <>
            <section className="persona-section">
              <label>Chat Response Length</label>

              {/* RANGE SLIDER */}
              <input
                type="range"
                min="25"
                max="100"
                step="25"
                value={persona.responseLength}
                onChange={(e) => {
                  setPersona({
                    ...persona,
                    responseLength: Number(e.target.value),
                  });
                  markDirty();
                }}
              />


              {/* CLICKABLE LABELS */}
              <div className="range-labels">
                {[
                  { label: "Minimal", value: 25 },
                  { label: "Short", value: 50 },
                  { label: "Long", value: 75 },
                  { label: "Chatty", value: 100 },
                ].map((opt) => (
                  <span
                    key={opt.value}
                    onClick={() => {
                      setPersona({
                        ...persona,
                        responseLength: opt.value,
                      });
                      markDirty();
                    }}
                    className={
                      persona.responseLength === opt.value ? "active" : ""
                    }
                  >
                    {opt.label}
                  </span>
                ))}
              </div>
            </section>


            <section className="persona-section">
              <label>Chat Guidelines</label>

              {persona.guidelines.map((g, i) => (
                <div className="guideline-row" key={i}>
                  <input
                    value={g}
                    onChange={(e) =>
                      updateGuideline(i, e.target.value)
                    }
                  />
                  <button onClick={() => deleteGuideline(i)}>
                    <FiTrash2 />
                  </button>
                </div>
              ))}

              <button className="add-btn" onClick={addGuideline}>
                <FiPlus /> Add new
              </button>
            </section>
          </>
        )}

        {/* SAVE BAR */}
        {isDirty && (
          <div className="save-bar">
            <button className="save-btn" onClick={savePersona}>
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPersona;
