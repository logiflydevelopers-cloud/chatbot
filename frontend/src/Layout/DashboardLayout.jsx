import Sidebar from "./Sidebar";
import "./dashboard.css";
import { Outlet } from "react-router-dom";

const DashboardLayout = ({ user }) => {
  return (
    <div className="dash-wrapper">
      <Sidebar user={user} />
      <div className="dash-content">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
