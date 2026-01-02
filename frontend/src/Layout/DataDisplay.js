import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // <-- ADD

const DataDisplay = ({ user, triggerRefresh }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // <-- ADD

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const n8nWebhookUrl = "http://localhost:5678/webhook/add-custom-website";

        const response = await fetch(n8nWebhookUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // <-- ADD (if token use)
          },
          credentials: "include", // <-- ADD (cookies send for refresh token)
        });

        // 🟥 USER DELETED OR TOKEN INVALID → AUTO LOGOUT
        if (response.status === 401 || response.status === 404) {
          console.warn("User deleted or session expired → auto-logout");

          // remove local storage data
          localStorage.removeItem("user");
          localStorage.removeItem("accessToken");

          navigate("/login"); // redirect
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP ભૂલ! સ્થિતિ: ${response.status}`);
        }

        const result = await response.json();
        console.log("Fetched n8n response:", result);

        // result handling
        if (Array.isArray(result)) {
          setData(result);
        } else if (result.data && Array.isArray(result.data)) {
          setData(result.data);
        } else {
          setData([]);
        }
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, triggerRefresh, navigate]);

  if (!user) return null;

  if (loading) return <div className="loading">ડેટા લોડ થઈ રહ્યો છે...</div>;

  if (error)
    return <div className="error">ડેટા લોડ કરવામાં ભૂલ થઈ: {error.message}</div>;

  if (data.length > 0) {
    return (
      <div className="data-container">
        <h2>તમારા Websites</h2>
        <ul>
          {data.map((item, index) => (
            <li key={index}>
              <strong>ID:</strong> {item.id} <br />
              <strong>નામ:</strong> {item.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return <div className="no-data">હજુ સુધી કોઈ Website ઉમેરાઈ નથી.</div>;
};

export default DataDisplay;
