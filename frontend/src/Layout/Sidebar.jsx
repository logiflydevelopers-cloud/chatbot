import { NavLink } from "react-router-dom";
import "./dashboard.css";

const Sidebar = () => {
  return (
    <div className="sidebar">


      <NavLink to="/dashboard/persona" className="side-item">
        <span>🤖</span> AI PERSONA
      </NavLink>

      <NavLink to="/dashboard/knowledge" className="side-item">
        <span>📘</span> KNOWLEDGE BASE
      </NavLink>

      <NavLink to="/dashboard/teach" className="side-item">
        <span>💬</span> TEACH YOUR AGENT
      </NavLink>

    </div>
  );
};

export default Sidebar;
