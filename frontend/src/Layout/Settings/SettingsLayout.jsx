import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./settings.css";

const SettingsLayout = ({ user, setUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isSettingsHome = location.pathname === "/settings";

  const pageTitleMap = {
    "/settings/account": "Account Settings",
    "/settings/security": "Security Settings",
  };

  const pageTitle = pageTitleMap[location.pathname];

  /* ================= MOBILE SETTINGS HOME ================= */
  /* ================= MOBILE SETTINGS HOME ================= */
  if (isMobile && isSettingsHome) {
    return (
      <div className="settings-mobile-home">

        {/* ✅ MOBILE BACK HEADER */}
        <div className="settings-mobile-header">
          <button
            className="fu-back-btn"
            onClick={() => navigate("/dashboard/knowledge")}
          >
            ←
          </button>

          <h2 className="settings-title">Settings</h2>
        </div>

        <div
          className="settings-card"
          onClick={() => navigate("/settings/account")}
        >
          <span>Account</span>
          <p>Profile & personal info</p>
        </div>

        <div
          className="settings-card"
          onClick={() => navigate("/settings/security")}
        >
          <span>Security</span>
          <p>Password & authentication</p>
        </div>

      </div>
    );
  }


  /* ================= DETAIL PAGE ================= */
  return (
    <div className="settings-root">
      {!isMobile && (
        <aside className="settings-sidebar">
          <NavLink to="/settings/account" className="settings-link">Account</NavLink>
          <NavLink to="/settings/security" className="settings-link">Security</NavLink>
        </aside>
      )}

      <main className="settings-content">
        {/* ✅ MOBILE HEADER BAR */}
        {isMobile && pageTitle && (
          <div className="settings-mobile-header">
            <button className="fu-back-btn" onClick={() => navigate("/settings")}>
              ←
            </button>


            <h2>{pageTitle}</h2>
          </div>
        )}

        <Outlet context={{ user, setUser }} />
      </main>
    </div>
  );
};

export default SettingsLayout;
