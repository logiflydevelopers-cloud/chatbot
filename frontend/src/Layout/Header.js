import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "./Header.css";
import logo from "../image/SellChat Logo.png";
import axios from "axios";
import PopupModal from "../Components/Auth/Common/PopupModal"


function Header({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const apiBase = "http://localhost:4000";

  const userId = user?.id || user?._id;

  const [popup, setPopup] = useState({
    show: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };



  const isAdminRoute = location.pathname.startsWith("/admin");




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
      setPopup({
        show: true,
        title: "Website Required",
        message: "Please upload WEBSITE first to customize chatbot.",
        onConfirm: () => {
          setPopup({ ...popup, show: false });
          navigate("/dashboard/knowledge");
        },
      });
      return;
    }


    navigate("/custom-chat");
  };

  const handlePublishClick = () => {
    if (!localStorage.getItem("chatbotSaved")) {
      setPopup({
        show: true,
        title: "Action Required",
        message: "Please customize and SAVE chatbot first.",
        onConfirm: () => setPopup({ ...popup, show: false }),
      });
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
            <div className="avatar-initials">
              {getInitials(user?.name)}
            </div>
          )}

        </div>


        <PopupModal
          show={popup.show}
          title={popup.title}
          message={popup.message}
          onClose={() => setPopup({ ...popup, show: false })}
          onConfirm={popup.onConfirm}
        />


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
                  <div className="avatar-initials">
                    {getInitials(user?.name)}
                  </div>
                )}

              </div>

              <div>
                <p className="profile-hello">Hello,</p>
                <p className="profile-name">{user?.name}</p>
              </div>

              <span className="profile-plan">STARTER</span>
            </div>

            {/* <div className="profile-progress">
                <p className="progress-title">
                  Agents <span>7 of 5 used</span>
                </p>
                <div className="progress-bar">
                  <span style={{ width: "100%" }} />
                </div>
              </div> */}

            {/* <button className="upgrade-btn">Upgrade Your Plan</button> */}

            <ul className="profile-menu">
              <li
                onClick={() => {
                  setShowProfile(false); // 🔥 CLOSE POPUP
                  navigate(`/admin/dashboard/${userId}`);
                }}
              >
                Admin Console
              </li>




              <li
                onClick={() => {
                  setShowProfile(false); // 🔥 CLOSE POPUP
                  handleLogout();
                }}
              >
                Logout
              </li>

            </ul>
          </div>
        )
      }

      {/* ================= TOP BAR ================= */}
      {!isAdminRoute && (
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
      )}

    </>
  );
}

export default Header;
