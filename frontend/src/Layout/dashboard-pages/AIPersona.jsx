import React, { useState } from "react";
import {
  FiMessageSquare,
  FiMic,
  FiMail,
  FiTrash2,
  FiPlus,
  FiArrowLeft,
} from "react-icons/fi";
import { useOutletContext } from "react-router-dom";

import aiIcon from "../../image/ai.svg"; // correct path
import "./AIPersona.css";
import "./train-page.css";

const AIPersona = () => {
  // 👉 get sidebar controller from DashboardLayout
  const { setSidebarOpen } = useOutletContext();

  const [activeTab, setActiveTab] = useState("chat");
  const [range, setRange] = useState(25);

  const [guidelines, setGuidelines] = useState([
    "Your main goal is to promptly answer questions and resolve issues.",
    "Always provide helpful and clear solutions.",
    "Be polite and empathetic in all interactions.",
    "Maintain professionalism while being approachable and friendly.",
  ]);

  const addGuideline = () => setGuidelines([...guidelines, ""]);
  const updateGuideline = (i, v) =>
    setGuidelines(guidelines.map((g, idx) => (idx === i ? v : g)));
  const deleteGuideline = (i) =>
    setGuidelines(guidelines.filter((_, idx) => idx !== i));

  return (
    <div className="persona-container">
      {/* HEADER */}
      <div className="persona-header">
        {/* Mobile back button */}
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

      <div className="persona-card">
        {/* Agent Name */}
        <section className="persona-section">
          <label>Agent Name</label>
          <span>Give a name to your Agent that will be displayed</span>
          <input defaultValue="Ella" />
        </section>

        {/* Agent Role */}
        <section className="persona-section">
          <label>Agent Role</label>
          <span>Describe your Agent's job title</span>
          <input defaultValue="Customer Support Agent" />

          <div className="role-buttons">
            <button>Help Desk Specialist</button>
            <button>Client Service Representative</button>
            <button>Technical Support Agent</button>
          </div>
        </section>

        {/* Language */}
        <section className="persona-section">
          <label>Default Language</label>
          <span>Select the language your Agents greet users</span>
          <select>
            <option>English</option>
            <option>Hindi</option>
            <option>Gujarati</option>
          </select>
        </section>

        {/* Tone */}
        <section className="persona-section">
          <label>Tone of Voice</label>
          <span>Select how you would like the AI to communicate</span>
          <select>
            <option>Friendly</option>
            <option>Professional</option>
            <option>Casual</option>
          </select>
        </section>

        {/* Conversation Style */}
        <section className="persona-section">
          <label>Conversation Style</label>
          <span>Describe how your Agent will talk</span>

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

        {/* Chat Settings */}
        {activeTab === "chat" && (
          <>
            <section className="persona-section">
              <label>Chat Response Length</label>
              <input
                type="range"
                min="0"
                max="100"
                value={range}
                onChange={(e) => setRange(e.target.value)}
              />
              <div className="range-labels">
                <span>Minimal</span>
                <span>Short</span>
                <span>Long</span>
                <span>Chatty</span>
              </div>
            </section>

            <section className="persona-section">
              <label>Chat Guidelines</label>
              <span>Set clear rules for how your agent responds</span>

              {guidelines.map((g, i) => (
                <div className="guideline-row" key={i}>
                  <input
                    value={g}
                    onChange={(e) => updateGuideline(i, e.target.value)}
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
      </div>
    </div>
  );
};

export default AIPersona;
