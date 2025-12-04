import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Header.css";
import { FaUserCircle } from "react-icons/fa";
import logo from "../image/logo.png";

function Header({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const userId = user?.id || user?._id || user?.userId;

  const goDashboard = () => {
    navigate("/dashboard/train");
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("uploadedWebsite");
    localStorage.removeItem("hasPDF");
    localStorage.removeItem("hasQA");
    localStorage.removeItem("chatbotSaved");

    setUser(null);
    navigate("/login");
  };

  const goProfile = () => {
    if (!userId) {
      alert("User ID missing");
      return;
    }
    navigate(`/userDetails/${userId}`);
  };

  /* ---------------------------------------------------
     ⭐ CUSTOMIZE PROTECTION (FILE / LINK / Q&A ANY ONE)
  ----------------------------------------------------*/
  const handleCustomizeClick = () => {
    const hasPDF = localStorage.getItem("hasPDF");
    const hasQA = localStorage.getItem("hasQA");
    const hasWebsite = localStorage.getItem("uploadedWebsite");

    if (!hasPDF && !hasQA && !hasWebsite) {
      alert("⚠️ Please upload FILE, LINK or add Q&A first.");
      return;
    }

    navigate(`/custom-chat/${userId}`);
  };


  /* ---------------------------------------------------
     ⭐ PUBLISH PROTECTION
  ----------------------------------------------------*/
  const handlePublishClick = () => {
    if (!localStorage.getItem("chatbotSaved")) {
      alert("⚠️ Please customize and SAVE your chatbot before publishing.");
      return;
    }
    navigate(`/embed-code/${userId}`);
  };

  return (
    <>
      {/* HEADER */}
      <header className="jf-header">
        <div className="jf-left" onClick={goDashboard}>
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

      {/* TOP BLUE TABS */}
      <div className="jf-bluebar">

        {/* TRAIN */}
        <Link
          to="/dashboard/train"
          className={`jf-tab ${location.pathname.includes("/train") ? "active" : ""
            }`}
        >
          TRAIN
        </Link>

        {/* CUSTOMIZE */}
        <div
          onClick={handleCustomizeClick}
          className={`jf-tab ${location.pathname.includes("/custom-chat") ? "active" : ""
            }`}
        >
          CUSTOMIZE
        </div>

        {/* PUBLISH */}
        <div
          onClick={handlePublishClick}
          className={`jf-tab ${location.pathname.includes("/embed-code") ? "active" : ""
            }`}
        >
          PUBLISH
        </div>
      </div>
    </>
  );
}

export default Header;
