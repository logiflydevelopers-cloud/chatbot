
import { useState } from "react";
import "./goals.css";

const Goals = () => {
  // const { userId } = useParams();

  const [goals] = useState([
    {
      id: "g1",
      name: "Collect Email",
      type: "Lead",
      status: "Active",
    },
    {
      id: "g2",
      name: "Book Demo",
      type: "Conversion",
      status: "Inactive",
    },
  ]);

  return (
    <div className="goals-wrapper">
      {/* ===== BLURRED CONTENT ===== */}
      <div className="goals-blur-content">
        <div className="page-wrapper fade-in">
          <div className="page-header">
            <h2>Goals</h2>
            <button className="primary-btn">+ Create Goal</button>
          </div>

          <div className="goal-list">
            {goals.map((g) => (
              <div key={g.id} className="goal-card zoom-in">
                <div>
                  <h4>{g.name}</h4>
                  <p>Type: {g.type}</p>
                </div>

                <span
                  className={`status-badge ${
                    g.status === "Active" ? "active" : "inactive"
                  }`}
                >
                  {g.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== COMING SOON OVERLAY ===== */}
      <div className="goals-coming-overlay">
        <div className="goals-coming-box">
          🚧 Coming Soon
        </div>
      </div>
    </div>
  );
};

export default Goals;
