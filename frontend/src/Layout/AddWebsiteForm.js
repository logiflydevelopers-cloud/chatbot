import { useState } from "react";
import axios from "axios";
import styles from "./AddWebsiteForm.module.css";
import { useNavigate } from "react-router-dom";

const AddWebsiteForm = ({ user, onWebsiteAdded }) => {
  const [websiteName, setWebsiteName] = useState("");
  const [websiteURL, setWebsiteURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [data, setData] = useState([]);

  const navigate = useNavigate();

  // ✅ Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!websiteName || !websiteURL) {
      setMessage("⚠️ Please fill in all fields.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("https://n8n-production-5b8d.up.railway.app/webhook/add-custom-website", {
        userId: user?._id,
        name: websiteName,
        url: websiteURL,
      });

      localStorage.setItem("uploadedWebsite", websiteURL);

      setMessage("✅ Website added successfully!");
      setWebsiteName("");
      setWebsiteURL("");
      setData(res.data);

      console.log("Response data:", res.data);
    } catch (error) {
      console.error("Error sending data:", error);
      setMessage("❌ Failed to add website. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED — Chatbot Open (user._id → fallback added)
  const openChatbot = () => {
    console.log("openChatbot user:", user);

    // 🔥 safe fallback → backend कही કોઈપણ id આપે તો પણ चलेगा
    const uid = user?._id || user?.id || user?.userId;

    if (!uid) {
      alert("Please log in first.");
      return;
    }

    navigate(`/custom-chat/${uid}`);
  };

  return (
    <div className={styles.formContainer}>
      <h2>Add a Website</h2>

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label>Website Name</label>
          <input
            type="text"
            value={websiteName}
            onChange={(e) => setWebsiteName(e.target.value)}
            placeholder="Enter site name"
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Website URL</label>
          <input
            type="url"
            value={websiteURL}
            onChange={(e) => setWebsiteURL(e.target.value)}
            placeholder="https://example.com"
          />
        </div>

        <button type="submit" disabled={loading} className={styles.submitButton}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {message && <p className={styles.message}>{message}</p>}

      {data.length > 0 && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            borderRadius: "12px",
            backgroundColor: "#f9fafb",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          {/* Chatbot Button */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <button
              onClick={openChatbot}
              className={styles.chatButton}
              style={{
                backgroundColor: "#2563eb",
                color: "white",
                padding: "12px 24px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "16px",
                transition: "background-color 0.2s ease, transform 0.2s ease",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#1e40af")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#2563eb")}
            >
              💬 Open Chatbot
            </button>
          </div>

          {/* Response Data */}
          <div>
            <h3
              style={{
                textAlign: "center",
                color: "#1e293b",
                marginBottom: "12px",
                borderBottom: "2px solid #2563eb",
                display: "inline-block",
                paddingBottom: "4px",
              }}
            >
              Response Data
            </h3>

            <div
              style={{
                marginTop: "15px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                color: "#334155",
                fontSize: "14px",
              }}
            >
              {data.map((item, index) => (
                <div
                  key={index}
                  style={{
                    background: "#ffffff",
                    padding: "10px 14px",
                    borderRadius: "6px",
                    border: "1px solid #e2e8f0",
                    wordBreak: "break-word",
                  }}
                >
                  <strong>🔗 URL:</strong>{" "}
                  <a
                    href={item.loc}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#2563eb", textDecoration: "none" }}
                  >
                    {item.loc}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddWebsiteForm;
