import React, { useState, useEffect } from "react";
import "./AddWebsite.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./train-page.css";

const AddWebsiteForm = ({ user }) => {
  const navigate = useNavigate();

  const [url, setUrl] = useState("");
  const [storedWebsite, setStoredWebsite] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupLoading, setPopupLoading] = useState(false);
  const [popupMsg, setPopupMsg] = useState("");


  const userId = user?._id || user?.id || user?.userId;

  /* ================= LOAD FROM DB ================= */
  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:4000/api/chatbot/${userId}`)
      .then((res) => {
        const website = res.data?.settings?.website;
        if (website) {
          setStoredWebsite(website);
          setUrl(website);
        }
      })
      .catch(() => { });
  }, [userId]);

  /* ================= CRAWL WEBSITE ================= */
  const handleCrawl = async () => {
    if (!url.trim()) {
      setError("⚠️ Please enter a website URL");
      return;
    }

    try {
      setPopupLoading(true);
      setShowPopup(true);
      setError("");
      setSuccess("");

      await axios.post(
        "http://localhost:4000/api/webhook/ingest-website",
        {
          userId,
          source: url.trim(),
        }
      );

      // ⏳ same FileUpload jevu delay
      setTimeout(() => {
        setPopupLoading(false);
        setPopupMsg("✅ Website uploaded. Training started.");
        setStoredWebsite(url.trim());
      }, 2000);

    } catch (err) {
      setPopupLoading(false);
      setShowPopup(false);
      setError(
        err?.response?.data?.message ||
        "❌ Failed to upload website"
      );
    }
  };


  return (
    <div className="persona-container">
      <div className="link-header-row persona-header">
        <button
          className="fu-back-btn"
          onClick={() => navigate("/dashboard/knowledge")}
        >
          ←
        </button>

        <div>
          <h2>LINK</h2>
          <p>Add website URLs to train your Agent</p>
        </div>
      </div>

      <div className="link-card">
        <label className="label-text">Enter a URL</label>
        <p className="help-text">Provide a URL for your agent to analyze</p>

        {/* 🔒 INPUT LOCK */}
        <input
          type="text"
          className="link-input"
          value={url}
          disabled={!!storedWebsite}
          onChange={(e) => setUrl(e.target.value)}
        />

        {storedWebsite && (
          <p className="info-text">
            🔒 Website uploaded successfully.
          </p>
        )}

        {/* 🔒 BUTTON LOCK */}
        <button
          className="crawl-btn"
          onClick={handleCrawl}
          disabled={popupLoading || !!storedWebsite}
          style={{
            opacity: storedWebsite ? 0.5 : 1,
            cursor: storedWebsite ? "not-allowed" : "pointer"
          }}
        >
          {popupLoading ? "Uploading..." : "Crawl"}
        </button>



        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}
      </div>

      {/* ================= POPUP ================= */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            {popupLoading ? (
              <>
                <div className="loader"></div>
                <p>Uploading...</p>
              </>
            ) : (
              <>
                <p>{popupMsg}</p>
                <button
                  className="popup-box-btn"
                  onClick={() => setShowPopup(false)}
                >
                  OK
                </button>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default AddWebsiteForm;
