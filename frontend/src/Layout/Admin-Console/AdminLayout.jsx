import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./admin.css";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isAdminHome =
    location.pathname === "/admin" ||
    location.pathname === "/admin/";

  const pageTitleMap = {
    "/admin/dashboard": "Dashboard",
    "/admin/goals": "Goals",
    "/admin/campaigns": "Campaigns",
    "/admin/customers": "Customers",
  };

  const pageTitle = pageTitleMap[location.pathname];

  /* ================= MOBILE HOME (LIST ONLY) ================= */
  if (isMobile && isAdminHome) {
    return (
      <div className="admin-mobile-home fade-in">
        <h2 className="admin-title">Admin Console</h2>

        <div className="admin-card" onClick={() => navigate("/admin/dashboard")}>
          Dashboard
        </div>

        <div className="admin-card" onClick={() => navigate("/admin/goals")}>
          Goals
        </div>

        <div className="admin-card" onClick={() => navigate("/admin/campaigns")}>
          Campaigns
        </div>

        <div className="admin-card" onClick={() => navigate("/admin/customers")}>
          Customers
        </div>
      </div>
    );
  }

  /* ================= MAIN LAYOUT ================= */
  return (
    <div className="admin-root fade-in">
      {/* ===== DESKTOP SIDEBAR ===== */}
      {!isMobile && (
        <aside className="admin-sidebar">
          <NavLink to="/admin/dashboard" className="admin-link">
            Dashboard
          </NavLink>
          <NavLink to="/admin/goals" className="admin-link">
            Goals
          </NavLink>
          <NavLink to="/admin/campaigns" className="admin-link">
            Campaigns
          </NavLink>
          <NavLink to="/admin/customers" className="admin-link">
            Customers
          </NavLink>
        </aside>
      )}

      {/* ===== CONTENT ===== */}
      <main className="admin-content">
        {/* ✅ MOBILE HEADER (ONLY WHEN PAGE OPEN) */}
        {isMobile && pageTitle && (
          <div className="admin-mobile-header slide-down">
            <button
              className="back-btn"
              onClick={() => navigate("/admin")}
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
