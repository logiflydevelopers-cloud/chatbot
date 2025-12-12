import React, { useState, useEffect } from "react";
import "./AddWebsite.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddWebsite = ({ user }) => {
  const navigate = useNavigate();

  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [storedDomain, setStoredDomain] = useState("");

  /* =====================================================
        ⭐ LOAD STORED WEBSITE ON REFRESH
  ===================================================== */
  useEffect(() => {
    const saved = localStorage.getItem("uploadedWebsite");
    if (saved) {
      setUrl(saved);
      setStoredDomain(new URL(saved).hostname);
    }
  }, []);

  /* =====================================================
        ⭐ CRAWL + SAVE WEBSITE
  ===================================================== */
  const handleCrawl = async () => {
    setError("");
    setSuccess("");

    if (!url.trim()) {
      setError("⚠️ Please enter a website URL before crawling.");
      return;
    }

    const pattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/;
    if (!pattern.test(url.trim())) {
      setError("❌ Invalid URL. Please enter a valid website link.");
      return;
    }

    try {
      setLoading(true);

      const userId = user?._id || user?.id || user?.userId;
      if (!userId) {
        setError("❌ User ID missing. Please login again.");
        return;
      }

      const websiteURL = url.trim();
      const domainName = new URL(websiteURL).hostname;

      /* 1️⃣ — SAVE WEBSITE PAGES IN BACKEND */
      await axios.post("http://localhost:4000/api/webhook/add-custom-website", {
        userId,
        url: websiteURL,
        name: domainName,
      });

      /* 2️⃣ — SEND WEBSITE TO N8N WORKFLOW */
      await axios.post(
        "http://localhost:5678/webhook-test/add-custom-website",
        {
          userId,
          websiteURL,
        },
        { withCredentials: false }
      );

      /* 3️⃣ — UPDATE Chatbot Settings (website field only) */
      await axios.post("http://localhost:4000/api/chatbot/save", {
        userId,
        website: websiteURL,
      });

      /* 4️⃣ — SAVE IN LOCAL STORAGE */
      localStorage.setItem("uploadedWebsite", websiteURL);

      const ls = localStorage.getItem("chatbot_settings");
      if (ls) {
        const updated = { ...JSON.parse(ls), website: websiteURL };
        localStorage.setItem("chatbot_settings", JSON.stringify(updated));
      }

      setStoredDomain(domainName);
      setSuccess("✅ Website uploaded successfully!");
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      setError("❌ Failed to upload website. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
        ⭐ REMOVE WEBSITE (DB + LOCAL)
  ===================================================== */
  const removeWebsite = async () => {
    if (!storedDomain) {
      alert("No website found to remove.");
      return;
    }

    const userId = user?._id || user?.id || user?.userId;

    if (!window.confirm("Are you sure you want to remove this website?")) return;

    try {
      /* 1️⃣ — DELETE WEBSITE PAGES FROM BACKEND */
      await axios.delete("http://localhost:4000/api/webhook/remove-website", {
        data: {
          userId,
          name: storedDomain,
        },
      });

      /* 2️⃣ — REMOVE FROM Chatbot Setting DB */
      await axios.post("http://localhost:4000/api/chatbot/save", {
        userId,
        website: null,
      });

      /* 3️⃣ — CLEAR LOCAL STORAGE */
      localStorage.removeItem("uploadedWebsite");

      const ls = localStorage.getItem("chatbot_settings");
      if (ls) {
        const updated = { ...JSON.parse(ls), website: null };
        localStorage.setItem("chatbot_settings", JSON.stringify(updated));
      }

      setUrl("");
      setStoredDomain("");
      setSuccess("✅ Website removed!");
    } catch (err) {
      console.log(err);
      setError("❌ Failed to remove website.");
    }
  };

  return (
    <div className="link-page-wrapper">
      <div className="link-header-row">
        <button className="back-btn" onClick={() => navigate("/dashboard/knowledge")}>
          ←
        </button>

        <div>
          <h2 className="link-title">LINK</h2>
          <p className="link-subtitle">
            Add website URLs to train your Agent with dynamic information
          </p>
        </div>
      </div>

      <div className="link-card">
        <label className="label-text">Enter a URL</label>
        <p className="help-text">Provide a URL for your agent to analyze</p>

        <input
          type="text"
          className="link-input"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        {storedDomain && (
          <button className="remove-url-btn" onClick={removeWebsite}>
            ❌ Remove Website
          </button>
        )}

        <hr />

        <label className="label-text">Enable Periodic Recrawling</label>
        <p className="help-text">Agent will automatically recrawl.</p>

        <div className="radio-row">
          <label><input type="radio" name="freq" /> Daily</label>
          <label><input type="radio" name="freq" /> Weekly</label>
          <label><input type="radio" name="freq" defaultChecked /> Monthly</label>
        </div>

        <button className="crawl-btn" onClick={handleCrawl} disabled={loading}>
          {loading ? "Uploading..." : "Crawl"}
        </button>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}
      </div>
    </div>
  );
};

export default AddWebsite;
