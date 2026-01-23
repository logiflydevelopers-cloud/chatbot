import { useLocation, useNavigate } from "react-router-dom";
import { FiUser, FiBookOpen, FiMessageSquare } from "react-icons/fi";
import "./dashboard.css";
import { FiSettings } from "react-icons/fi";


const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname.startsWith(path);

  const handleNavigate = (path) => {
    // Mobile logic
    if (window.innerWidth <= 768) {
      setOpen(false);

      // ⏳ Wait for sidebar close animation
      setTimeout(() => {
        navigate(path);
      }, 300); // must match CSS transition
    } else {
      navigate(path);
    }
  };

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>

      <div
        onClick={() => handleNavigate("/dashboard/persona")}
        className={`side-item ${isActive("/dashboard/persona") ? "active" : ""}`}
      >
        <FiUser className="icon" />
        <div>
          <p className="sidebar-title">AI PERSONA</p>
          <span className="sidebar-subtitle">
            How the Agent talks and acts
          </span>
        </div>
      </div>

      <div
        onClick={() => handleNavigate("/dashboard/knowledge")}
        className={`side-item ${isActive("/dashboard/knowledge") ? "active" : ""}`}
      >
        <FiBookOpen className="icon" />
        <div>
          <p className="sidebar-title">KNOWLEDGE BASE</p>
          <span className="sidebar-subtitle">
            Train Agent for context aware replies
          </span>
        </div>
      </div>

      <div
        onClick={async () => {
          try {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            const userId =
              storedUser?._id || storedUser?.id || storedUser?.userId;

            const res = await fetch(
              `http://localhost:4000/api/chatbot/${userId}`
            );
            const data = await res.json();

            // ❌ BLOCK IF WEBSITE NOT UPLOADED
            if (!data?.settings?.website) {
              alert("❌ Please upload a website first to use Teach Your Agent");
              return;
            }

            // ✅ ALLOW
            handleNavigate("/dashboard/teach");

          } catch (err) {
            console.error(err);
            alert("Something went wrong");
          }
        }}
        className={`side-item ${isActive("/dashboard/teach") ? "active" : ""}`}
      >
        <FiMessageSquare className="icon" />
        <div>
          <p className="sidebar-title">TEACH YOUR AGENT</p>
          <span className="sidebar-subtitle">
            Train your Agent with chat
          </span>
        </div>
      </div>


      <div
        onClick={() => handleNavigate("/settings")}
        className={`side-item ${isActive("/dashboard/settings") ? "active" : ""}`}
        style={{ marginTop: "auto" }}
      >
        <FiSettings className="icon" />
        <div>
          <p className="sidebar-title">SETTINGS</p>
          <span className="sidebar-subtitle">Account & Preferences</span>
        </div>
      </div>


    </aside>
  );
};

export default Sidebar;
