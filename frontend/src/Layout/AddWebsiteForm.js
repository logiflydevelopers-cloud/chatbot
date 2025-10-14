import { useState } from "react";
import axios from "axios";
import styles from "./AddWebsiteForm.module.css"; // create your CSS

const AddWebsiteForm = ({ user }) => {
  const [websiteName, setWebsiteName] = useState("");
  const [websiteURL, setWebsiteURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!websiteName || !websiteURL) {
      setMessage("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const accessToken = localStorage.getItem("accessToken");

      // Send data to n8n endpoint
      const res = await axios.post(
        "https://your-n8n-domain.com/webhook/add-website",
        {
          userId: user?.id,
          name: websiteName,
          url: websiteURL,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setMessage("Website added successfully!");
      setWebsiteName("");
      setWebsiteURL("");
    } catch (error) {
      console.error("Error sending data:", error);
      setMessage("Failed to add website. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Add a Website</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label>Website Name</label>
          <input
            type="text"
            value={websiteName}
            onChange={(e) => setWebsiteName(e.target.value)}
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Website URL</label>
          <input
            type="url"
            value={websiteURL}
            onChange={(e) => setWebsiteURL(e.target.value)}
          />
        </div>

        <button type="submit" disabled={loading} className={styles.submitButton}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default AddWebsiteForm;
    