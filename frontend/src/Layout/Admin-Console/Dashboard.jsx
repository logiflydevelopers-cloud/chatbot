import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const { userId } = useParams();
  const [stats, setStats] = useState({
    visitors: 0,
    todayChats: 0,
    totalChats: 0
  });

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/admin/dashboard-counts", {
        params: { userId }
      })
      .then(res => setStats(res.data));
  }, [userId]);

  return (
    <div className="dashboard-grid">
      <div className="dash-card"><p>Visitors</p><h1>{stats.visitors}</h1></div>
      <div className="dash-card"><p>Today Chats</p><h1>{stats.todayChats}</h1></div>
      <div className="dash-card"><p>Total Chats</p><h1>{stats.totalChats}</h1></div>
    </div>
  );
};

export default Dashboard;
