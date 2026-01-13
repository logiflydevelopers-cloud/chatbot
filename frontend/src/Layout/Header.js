import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "./Header.css";
import { FaUserCircle } from "react-icons/fa";
import logo from "../image/logo.png";
import axios from "axios";

function Header({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const apiBase = "http://localhost:4000";

  const userId = user?.id || user?._id;


  /* ================= PROFILE POPUP ================= */
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  /* ✅ FIXED OUTSIDE CLICK */
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!profileRef.current?.contains(e.target)) {
        setShowProfile(false);
      }
    };

    if (showProfile) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showProfile]);


  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login", { replace: true });
  };


  const isTrainActive =
    location.pathname.startsWith("/dashboard") &&
    !location.pathname.startsWith("/custom-chat") &&
    !location.pathname.startsWith("/embed-code");

  const handleCustomizeClick = async () => {
    if (!userId) return navigate("/login");

    const res = await axios.get(
      `${apiBase}/api/chatbot/knowledge-status/${userId}`
    );

    if (!res.data.hasWebsite) {
      alert("⚠️ Please upload WEBSITE first to customize chatbot.");
      navigate("/dashboard/knowledge");
      return;
    }

    navigate("/custom-chat");
  };

  const handlePublishClick = () => {
    if (!localStorage.getItem("chatbotSaved")) {
      alert("⚠️ Please customize and SAVE chatbot first.");
      return;
    }
    navigate(`/embed-code/${userId}`);
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="jf-header">
        <div
          className="jf-left"
          onClick={() => navigate("/dashboard/knowledge")}
        >
          <img src={logo} className="jf-logo" alt="logo" />
        </div>

        <div className="jf-center">
          <h2 className="jf-title">{user?.name}'s AI Assistant</h2>
        </div>

        {/* ✅ TOGGLE ICON */}
        <div
          className="jf-right"
          onClick={(e) => {
            e.stopPropagation();
            setShowProfile(prev => !prev);
          }}
        >

          {user?.avatar ? (
            <img
              src={`http://localhost:4000${user.avatar}`}
              alt="avatar"
              className="jf-user-icon avatar-img"
            />
          ) : (
            <FaUserCircle size={34} className="jf-user-icon" />
          )}
        </div>

      </header >

      {/* ================= PROFILE POPUP ================= */}
      {
        showProfile && (
          <div
            className="profile-popup"
            ref={profileRef}
            onClick={(e) => e.stopPropagation()} // 🔥 MUST
          >
            <div className="profile-header">
              <div className="profile-avatar">
                {user?.avatar ? (
                  <img
                    src={`http://localhost:4000${user.avatar}`}
                    alt="avatar"
                    className="jf-user-icon avatar-img"
                  />
                ) : (
                  <FaUserCircle size={34} className="jf-user-icon" />
                )}
              </div>

              <div>
                <p className="profile-hello">Hello,</p>
                <p className="profile-name">{user?.name}</p>
              </div>

              <span className="profile-plan">STARTER</span>
            </div>

            <div className="profile-progress">
              <p className="progress-title">
                Agents <span>7 of 5 used</span>
              </p>
              <div className="progress-bar">
                <span style={{ width: "100%" }} />
              </div>
            </div>

            <button className="upgrade-btn">Upgrade Your Plan</button>

            <ul className="profile-menu">
              <li onClick={() => navigate("/admin")}>Admin Console</li>
              <li onClick={() => navigate("/settings")}>Settings</li>


              <li onClick={handleLogout}>Logout</li>
            </ul>
          </div>
        )
      }

      {/* ================= TOP BAR ================= */}
      <div className="jf-bluebar">
        <NavLink
          to="/dashboard/knowledge"
          className={`jf-tab ${isTrainActive ? "active" : ""}`}
        >
          TRAIN
        </NavLink>

        <div
          onClick={handleCustomizeClick}
          className={`jf-tab ${location.pathname.startsWith("/custom-chat") ? "active" : ""
            }`}
        >
          CUSTOMIZE
        </div>

        <div
          onClick={handlePublishClick}
          className={`jf-tab ${location.pathname.startsWith("/embed-code") ? "active" : ""
            }`}
        >
          PUBLISH
        </div>
      </div>
    </>
  );
}

export default Header;
