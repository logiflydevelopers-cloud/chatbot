import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import "./dashboard.css";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="dash-wrapper">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="dash-content">
        <Outlet context={{ setSidebarOpen }} />
      </div>
    </div>
  );
};

export default DashboardLayout;
