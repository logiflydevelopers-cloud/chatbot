import "./campaigns.css";

const Campaigns = () => {
  const campaigns = [
    {
      id: "cmp1",
      name: "Website Visitors",
      status: "Running",
      chats: 24,
    },
    {
      id: "cmp2",
      name: "Pricing Page",
      status: "Paused",
      chats: 8,
    },
  ];

  return (
    <div className="campaigns-wrapper">
      {/* ===== BLURRED CONTENT ===== */}
      <div className="campaigns-blur-content">
        <div className="page-wrapper fade-in">
          <div className="page-header">
            <h2>Campaigns</h2>
            <button className="primary-btn">+ New Campaign</button>
          </div>

          <div className="campaign-grid">
            {campaigns.map((c) => (
              <div key={c.id} className="campaign-card zoom-in">
                <h4>{c.name}</h4>
                <p>Chats: {c.chats}</p>

                <span
                  className={`status-badge ${
                    c.status === "Running" ? "active" : "inactive"
                  }`}
                >
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== COMING SOON OVERLAY ===== */}
      <div className="campaigns-coming-overlay">
        <div className="campaigns-coming-box">
          🚧 Coming Soon
        </div>
      </div>
    </div>
  );
};

export default Campaigns;
