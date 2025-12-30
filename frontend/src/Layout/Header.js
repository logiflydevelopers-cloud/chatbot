import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./Header.css";
import { FaUserCircle } from "react-icons/fa";
import logo from "../image/logo.png";
import axios from "axios";


function Header({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const apiBase = "https://chatbot-backend-project.vercel.app";

  const userId = user?._id || user?.id || user?.userId;

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/login";
  };

  const goProfile = () => {
    if (!userId) return;
    navigate(`/userDetails/${userId}`);
  };

  /* ================= TRAIN ACTIVE ================= */
  const isTrainActive =
    location.pathname.startsWith("/dashboard") &&
    !location.pathname.startsWith("/custom-chat") &&
    !location.pathname.startsWith("/embed-code");

  /* ================= CUSTOMIZE ================= */
  const handleCustomizeClick = async () => {
    if (!userId) return navigate("/login");

    try {
      const res = await axios.get(
        `${apiBase}/api/chatbot/knowledge-status/${userId}`
      );

      if (!res.data.hasKnowledge) {
        alert("⚠️ Please upload FILE, LINK or add Q&A first.");
        navigate("/dashboard/knowledge");
        return;
      }

      navigate("/custom-chat");
    } catch (err) {
      alert("Something went wrong");
    }
  };

  /* ================= PUBLISH ================= */
  const handlePublishClick = () => {
    if (!localStorage.getItem("chatbotSaved")) {
      alert("⚠️ Please customize and SAVE chatbot first.");
      return;
    }
    navigate(`/embed-code/${userId}`);
  };

  return (
    <>
      {/* HEADER */}
      <header className="jf-header">
        <div className="jf-left" onClick={() => navigate("/dashboard/knowledge")}>
          <img src={logo} className="jf-logo" alt="logo" />
        </div>

        <div className="jf-center">
          <h2 className="jf-title">{user?.name}'s AI Assistant</h2>
        </div>

        <div className="jf-right" onClick={goProfile}>
          <FaUserCircle size={34} className="jf-user-icon" />
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          🔒 Logout
        </button>
      </header>

      {/* TOP BAR */}
      <div className="jf-bluebar">
        {/* TRAIN */}
        <NavLink
          to="/dashboard/knowledge"
          className={`jf-tab ${isTrainActive ? "active" : ""}`}
        >
          TRAIN
        </NavLink>

        {/* CUSTOMIZE */}
        <div
          onClick={handleCustomizeClick}
          className={`jf-tab ${
            location.pathname.startsWith("/custom-chat") ? "active" : ""
          }`}
        >
          CUSTOMIZE
        </div>

        {/* PUBLISH */}
        <div
          onClick={handlePublishClick}
          className={`jf-tab ${
            location.pathname.startsWith("/embed-code") ? "active" : ""
          }`}
        >
          PUBLISH
        </div>
      </div>
    </>
  );
}

export default Header;
