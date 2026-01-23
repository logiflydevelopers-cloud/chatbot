import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useEffect, useState } from "react";
import "./admin.css";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = useParams();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // 🔥 NEW: mobile home controller (JUST LIKE SIDEBAR)
  const [showMobileHome, setShowMobileHome] = useState(true);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // whenever route changes → hide mobile home
  useEffect(() => {
    if (!location.pathname.endsWith(`/dashboard/${userId}`)) {
      setShowMobileHome(false);
    }
  }, [location.pathname, userId]);

  const pageTitleMap = {
    [`/admin/dashboard/${userId}`]: "Dashboard",
    [`/admin/goals/${userId}`]: "Goals",
    [`/admin/campaigns/${userId}`]: "Campaigns",
    [`/admin/customers/${userId}`]: "Customers",
  };

  const pageTitle = pageTitleMap[location.pathname];

  /* ================= MOBILE HOME ================= */
  if (isMobile && showMobileHome) {
    return (
      <div className="admin-mobile-home fade-in">

        {/* ✅ MOBILE BACK HEADER (LIKE SETTINGS) */}
        <div className="admin-mobile-header">
          <button
            className="back-btn"
            onClick={() => navigate("/dashboard/knowledge")}
          >
            ←
          </button>

          <h2 className="admin-title">Admin Console</h2>
        </div>

        <div
          className="admin-card"
          onClick={() => {
            setShowMobileHome(false);
            navigate(`/admin/dashboard/${userId}`);
          }}
        >
          Dashboard
        </div>

        <div
          className="admin-card"
          onClick={() => {
            setShowMobileHome(false);
            navigate(`/admin/goals/${userId}`);
          }}
        >
          Goals
        </div>

        <div
          className="admin-card"
          onClick={() => {
            setShowMobileHome(false);
            navigate(`/admin/campaigns/${userId}`);
          }}
        >
          Campaigns
        </div>

        <div
          className="admin-card"
          onClick={() => {
            setShowMobileHome(false);
            navigate(`/admin/customers/${userId}`);
          }}
        >
          Customers
        </div>

      </div>
    );
  }

  /* ================= MAIN LAYOUT ================= */
  return (
    <div className="admin-root fade-in">
      {/* ===== SIDEBAR (DESKTOP) ===== */}
      {!isMobile && (
        <aside className="admin-sidebar">
          <NavLink to={`/admin/dashboard/${userId}`} className="admin-link">
            Dashboard
          </NavLink>
          <NavLink to={`/admin/goals/${userId}`} className="admin-link">
            Goals
          </NavLink>
          <NavLink to={`/admin/campaigns/${userId}`} className="admin-link">
            Campaigns
          </NavLink>
          <NavLink to={`/admin/customers/${userId}`} className="admin-link">
            Customers
          </NavLink>
        </aside>
      )}

      {/* ===== CONTENT ===== */}
      <main className="admin-content">
        {/* 🔥 MOBILE HEADER */}
        {isMobile && pageTitle && (
          <div className="admin-mobile-header slide-down">
            <button
              className="back-btn"
              onClick={() => setShowMobileHome(true)}
            >
              ←
            </button>
            <h3>{pageTitle}</h3>
          </div>
        )}

        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
