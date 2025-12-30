import { NavLink, useLocation } from "react-router-dom";
import {
  FiUser,
  FiBookOpen,
  FiMessageSquare,
  FiMic,
} from "react-icons/fi";
import "./dashboard.css";

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  // 👇 CLOSE SIDEBAR ONLY ON MOBILE
  const handleItemClick = () => {
    if (window.innerWidth <= 768) {
      setOpen(false);
    }
  };

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <NavLink
        to="/dashboard/persona"
        onClick={handleItemClick}
        className={`side-item ${isActive("/dashboard/persona") ? "active" : ""}`}
      >
        <FiUser className="icon" />
        <div>
          <p className="sidebar-title">AI PERSONA</p>
          <span className="sidebar-subtitle">How the Agent talks and acts</span>
        </div>
      </NavLink>

      <NavLink
        to="/dashboard/knowledge"
        onClick={handleItemClick}
        className={`side-item ${isActive("/dashboard/knowledge") ? "active" : ""}`}
      >
        <FiBookOpen className="icon" />
        <div>
          <p className="sidebar-title">KNOWLEDGE BASE</p>
          <span className="sidebar-subtitle">Train Agent for context aware replies</span>
        </div>
      </NavLink>

      <NavLink
        to="/dashboard/teach"
        onClick={handleItemClick}
        className={`side-item ${isActive("/dashboard/teach") ? "active" : ""}`}
      >
        <FiMessageSquare className="icon" />
        <div>
          <p className="sidebar-title">TEACH YOUR AGENT</p>
          <span className="sidebar-subtitle">Train your Agent with chat</span>
        </div>
      </NavLink>

      <NavLink
        to="/dashboard/voice-agent"
        onClick={handleItemClick}
        className={`side-item ${isActive("/dashboard/voice-agent") ? "active" : ""}`}
      >
        <FiMic className="icon" />
        <div>
          <p>VOICE AGENT</p>
          <span className="sidebar-subtitle">Voice-based AI agent</span>
        </div>
      </NavLink>
    </aside>
  );
};

export default Sidebar;
