import React, { useState, useEffect } from "react";
import "./AddWebsite.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./train-page.css";

const AddWebsite = ({ user }) => {
  const navigate = useNavigate();

  const [url, setUrl] = useState("");
  const [storedDomain, setStoredDomain] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  /* =====================================================
        ⭐ LOAD WEBSITE FROM DATABASE (SOURCE OF TRUTH)
  ===================================================== */
  useEffect(() => {
    const loadWebsite = async () => {
      try {
        const userId = user?._id || user?.id || user?.userId;
        if (!userId) return;

        const res = await axios.get(
          `https://chatbot-backend-project.vercel.app/api/chatbot/${userId}`
        );

        if (res.data?.settings?.website) {
          setUrl(res.data.settings.website);
          setStoredDomain(new URL(res.data.settings.website).hostname);
        }
      } catch (err) {
        console.error("Failed to fetch website from DB", err);
      }
    };

    loadWebsite();
  }, [user]);

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

      /* 1️⃣ SAVE WEBSITE PAGES */
      await axios.post("https://chatbot-backend-project.vercel.app/api/webhook/add-custom-website", {
        userId,
        url: websiteURL,
        name: domainName,
      });

      /* 2️⃣ SEND TO N8N */
      await axios.post(
        "http://localhost:5678/webhook-test/add-custom-website",
        { userId, websiteURL },
        { withCredentials: false }
      );

      /* 3️⃣ SAVE WEBSITE IN CHATBOT SETTINGS */
      await axios.post("https://chatbot-backend-project.vercel.app/api/chatbot/save", {
        userId,
        website: websiteURL,
      });

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
        ⭐ REMOVE WEBSITE (DB ONLY)
  ===================================================== */
  const removeWebsite = async () => {
    if (!storedDomain) return;

    if (!window.confirm("Are you sure you want to remove this website?")) return;

    try {
      const userId = user?._id || user?.id || user?.userId;

      /* 1️⃣ REMOVE WEBSITE PAGES */
      await axios.delete("https://chatbot-backend-project.vercel.app/api/webhook/remove-website", {
        data: {
          userId,
          name: storedDomain,
        },
      });

      /* 2️⃣ CLEAR WEBSITE FROM SETTINGS */
      await axios.post("https://chatbot-backend-project.vercel.app/api/chatbot/save", {
        userId,
        website: null,
      });

      setUrl("");
      setStoredDomain("");
      setSuccess("✅ Website removed successfully!");
    } catch (err) {
      console.error(err);
      setError("❌ Failed to remove website.");
    }
  };

  return (
    <div className="persona-container">
      <div className="link-header-row persona-header">
        <button className="fu-back-btn" onClick={() => navigate("/dashboard/knowledge")}>
                    ←
                </button>

        <div>
          <h2>LINK</h2>
          <p>
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

        <hr className="hrhr"/>

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
