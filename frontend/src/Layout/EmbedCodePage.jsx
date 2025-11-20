import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EmbedCodePage = ({ user }) => {
  const { userId } = useParams();
  const navigate = useNavigate();

  // 🔐 Prevent access without login
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // ✅ Correct API base (your chatbot backend is on port 5000)
  const embedCode = `<script src="https://demo-chatbot-backend.vercel.app/embed/${userId}.js" async></script>`;

  const copyCode = () => {
    navigator.clipboard.writeText(embedCode);
    alert("✅ Embed code copied!");
  };

  return (
    <div style={{ padding: "40px", textAlign: "center", background: "#fff", height: "100vh" }}>
      
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#111",
          color: "#fff",
          padding: "15px 30px",
        }}
      >
        <button
          onClick={() => navigate(`/custom-chat/${userId}`)}
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            padding: "8px 20px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>
        <h2>Get Your Embed Code</h2>
        <div></div>
      </div>

      <p style={{ marginTop: "40px", color: "#374151" }}>
        Paste this script into your website, Shopify, or WordPress to display your chatbot.
      </p>

      {/* Code Box */}
      <pre
        style={{
          background: "#f7f8fa",
          padding: "20px",
          width: "80%",
          margin: "20px auto",
          borderRadius: "10px",
          border: "1px solid #ddd",
          overflowX: "auto"
        }}
      >
        {embedCode}
      </pre>

      {/* Copy Button */}
      <button
        onClick={copyCode}
        style={{
          background: "#22c55e",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        📋 Copy Code
      </button>

      {/* Instructions */}
      <div style={{ marginTop: "30px" }}>
        <h3>How to embed on WordPress or Shopify?</h3>
        <ol style={{ textAlign: "left", maxWidth: "500px", margin: "auto" }}>
          <li>Click <b>Copy Code</b></li>
          <li>Go to your WordPress/Shopify editor</li>
          <li>Add a <b>Custom HTML</b> block</li>
          <li>Paste the code there and save</li>
        </ol>
      </div>
    </div>
  );
};

export default EmbedCodePage;
