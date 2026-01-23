import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Customers.css";

const Customers = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [customers, setCustomers] = useState([]);
  const [range, setRange] = useState("all");
  const [loading, setLoading] = useState(true);

  const apiBase = "http://localhost:4000";

  // 🔹 FORMAT DATE & TIME
  const formatDateTime = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);

        const url =
          range === "all"
            ? `${apiBase}/api/admin/customers/${userId}`
            : `${apiBase}/api/admin/customers/${userId}/filter?range=${range}`;

        const res = await axios.get(url);
        setCustomers(res.data || []);
      } catch (err) {
        console.error("Failed to load customers", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [userId, range]);

  return (
    <div className="customers-page">

      {/* ===== FILTER ===== */}
      <div className="customers-filter">
        <select value={range} onChange={(e) => setRange(e.target.value)}>
          <option value="all">All</option>
          <option value="today">Today</option>
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
        </select>
      </div>

      {/* ===== CONTENT ===== */}
      {loading ? (
        <p className="state-text">Loading customers...</p>
      ) : customers.length === 0 ? (
        <p className="state-text">No customers found</p>
      ) : (
        <div className="customers-grid">
          {customers.map((c) => (
            <div
              key={c.leadId}
              className="customer-card"
              onClick={() =>
                navigate(`/admin/customers/${userId}/${c.leadId}`)
              }
            >
              <div className="avatar">
                {(c.name || c.email || "U")[0].toUpperCase()}
              </div>

              <div className="info">
                <h4>{c.name || "Anonymous User"}</h4>
                <p className="email">{c.email || "No email available"}</p>

                {/* ⏰ TIME */}
                {c.lastMessageAt && (
                  <span className="time">
                    {formatDateTime(c.lastMessageAt)}
                  </span>
                )}
              </div>

              <span className="arrow">›</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Customers;
