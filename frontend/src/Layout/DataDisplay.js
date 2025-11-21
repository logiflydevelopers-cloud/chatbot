import React, { useState, useEffect } from "react";

const DataDisplay = ({ user, triggerRefresh }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const n8nWebhookUrl = "https://n8n-production-5b8d.up.railway.app/webhook/add-custom-website";

        const response = await fetch(n8nWebhookUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ભૂલ! સ્થિતિ: ${response.status}`);
        }

        const result = await response.json();
        console.log("Fetched n8n response:", result);

        /**
         * n8n return structure check:
         * 1️⃣ Direct array: [{id:1,name:"Site A"}, ...]
         * 2️⃣ Object with data field: {data: [{id:1,name:"Site A"}, ...]}
         */
        if (Array.isArray(result)) {
          setData(result);
        } else if (result.data && Array.isArray(result.data)) {
          setData(result.data);
        } else {
          // fallback: wrap single object in array or empty
          setData([]);
        }
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, triggerRefresh]);

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
