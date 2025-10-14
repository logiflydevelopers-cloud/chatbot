import React, { useState, useEffect } from 'react';
import axios from 'axios';

const N8nDataDisplay = () => {
  const [n8nData, setN8nData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Node.js બેકએન્ડથી ડેટા મેળવવાનો કોડ
    const fetchData = async () => {
      try {
        const response = await axios.get('https://logifly.app.n8n.cloud/webhook-test/add-website');
        setN8nData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>ડેટા લોડ થઈ રહ્યો છે...</p>;
  }

  if (error) {
    return <p>ડેટા મેળવવામાં ભૂલ: {error.message}</p>;
  }

  return (
    <div>
      <h1>n8n ડેટા</h1>
      <p>{n8nData.message}</p>
      <h2>ઉત્પાદનો</h2>
      <ul>
        {n8nData.data.map((item) => (
          <li key={item.id}>
            <strong>{item.name}</strong> - ₹{item.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default N8nDataDisplay;
