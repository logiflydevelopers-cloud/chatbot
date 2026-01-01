import React from "react";
import "./KnowledgeBase.css";
import "./train-page.css";
// import { FiFileText } from "react-icons/fi";
import { FaLink, FaQuestionCircle } from "react-icons/fa";
import { AiOutlineFolderOpen } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import aiIcon from "../../image/ai.svg";
import {
  FiArrowLeft,
} from "react-icons/fi";
import { useOutletContext } from "react-router-dom";

const KnowledgeBase = () => {
  const navigate = useNavigate();
  const { setSidebarOpen } = useOutletContext();

  return (
    <div className="persona-container">

      {/* Title */}
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
          <h2>KNOWLEDGE BASE</h2>
          <p>Train your Agent for context-aware responses to ensure accurate replies</p>
        </div>
      </div>

      {/* Search Row */}
      <div className="kb-search-row">
        <input className="kb-search" type="text" placeholder="Search" />
        <select className="kb-dropdown">
          <option>See All</option>
        </select>
      </div>

      {/* FILE CARD */}
      <div
        className="kb-card"
        onClick={() => navigate("/dashboard/knowledge/file")}
        style={{ cursor: "pointer" }}
      >
        <div className="kb-icon blue"><AiOutlineFolderOpen /></div>
        <div className="kb-info">
          <h3>FILE</h3>
          <p>Upload files to train your Agent</p>
        </div>
        <div className="kb-arrow">&#8250;</div>
      </div>

      {/* LINK CARD */}
      <div
        className="kb-card"
        onClick={() => navigate("/dashboard/add-website")}
        style={{ cursor: "pointer" }}
      >
        <div className="kb-icon yellow"><FaLink /></div>
        <div className="kb-info">
          <h3>LINK</h3>
          <p>Add website URLs to train your Agent with dynamic information</p>
        </div>
        <div className="kb-arrow">&#8250;</div>
      </div>

      {/* Q&A CARD — FIXED */}
      <div
        className="kb-card"
        onClick={() => navigate("/dashboard/knowledge/qa")}
        style={{ cursor: "pointer" }}
      >
        <div className="kb-icon purple"><FaQuestionCircle /></div>
        <div className="kb-info">
          <h3>QUESTIONS & ANSWER</h3>
          <p>Provide question-answer pairs your agent can use</p>
        </div>
        <div className="kb-arrow">&#8250;</div>
      </div>

      <button className="kb-more-btn">SHOW MORE SOURCES</button>
    </div>
  );
};

export default KnowledgeBase;
