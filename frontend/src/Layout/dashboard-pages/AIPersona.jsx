import React, { useState } from "react";
import "./AIPersona.css";

const AIPersona = () => {

  const [guidelines, setGuidelines] = useState([
    "Your main goal is to promptly answer questions and resolve issues.",
    "Always provide helpful and clear solutions.",
    "Be polite and empathetic in all interactions.",
    "Maintain professionalism while being approachable and friendly."
  ]);

  const addGuideline = () => {
    setGuidelines([...guidelines, ""]);
  };

  const updateGuideline = (index, value) => {
    const copy = [...guidelines];
    copy[index] = value;
    setGuidelines(copy);
  };

  const deleteGuideline = (index) => {
    const copy = guidelines.filter((_, i) => i !== index);
    setGuidelines(copy);
  };

  return (
    <div className="persona-container">

      {/* Title */}
      <h2 className="persona-title">AI PERSONA</h2>
      <p className="persona-subtitle">Write and customize how the AI talks and acts</p>

      <div className="persona-card">

        {/* Agent Name */}
        <div className="persona-section">
          <label className="persona-label">Agent Name</label>
          <p className="persona-text">Give a name to your Agent that will be displayed in the conversation</p>
          <input className="persona-input" defaultValue="Ella" />
        </div>

        {/* Agent Role */}
        <div className="persona-section">
          <label className="persona-label">Agent Role</label>
          <p className="persona-text">Describe your Agent's job title</p>
          <input className="persona-input" defaultValue="Customer Support Agent" />

          <div className="role-buttons">
            <button className="role-btn">Help Desk Specialist</button>
            <button className="role-btn">Client Service Representative</button>
            <button className="role-btn">Technical Support Agent</button>
          </div>
        </div>

        {/* Default Language */}
        <div className="persona-section">
          <label className="persona-label">Default Language</label>
          <p className="persona-text">Select the language your Agents greet users</p>
          <select className="persona-input">
            <option>English</option>
            <option>Hindi</option>
            <option>Gujarati</option>
          </select>
        </div>

        {/* Tone of Voice */}
        <div className="persona-section">
          <label className="persona-label">Tone of Voice</label>
          <p className="persona-text">Select how you would like the AI to communicate</p>

          <select className="persona-input">
            <option>Friendly</option>
            <option>Professional</option>
            <option>Casual</option>
          </select>
        </div>

        {/* Conversation Style Tabs */}
        <div className="persona-section">
          <label className="persona-label">Conversation Style</label>
          <p className="persona-text">Describe how your Agent will talk</p>

          <div className="tab-box">
            <button className="tab-btn active">Chat</button>
            <button className="tab-btn">Voice</button>
            <button className="tab-btn">Email</button>
          </div>
        </div>

        {/* Chat Response Length */}
        <div className="persona-section">
          <label className="persona-label">Chat Response Length</label>
          <input type="range" min="1" max="100" className="range-slider" />

          <div className="range-labels">
            <span>Minimal</span>
            <span>Short</span>
            <span>Long</span>
            <span>Chatty</span>
          </div>
        </div>

        {/* Guidelines */}
        <div className="persona-section">
          <label className="persona-label">Chat Guidelines</label>
          <p className="persona-text">Set clear rules for how your agent responds</p>

          {guidelines.map((g, i) => (
            <div className="guideline-row" key={i}>
              <input
                className="guideline-input"
                value={g}
                onChange={(e) => updateGuideline(i, e.target.value)}
              />
              <button className="delete-btn" onClick={() => deleteGuideline(i)}>🗑</button>
            </div>
          ))}

          <button className="add-btn" onClick={addGuideline}>+ Add new</button>
        </div>

      </div>
    </div>
  );
};

export default AIPersona;
    