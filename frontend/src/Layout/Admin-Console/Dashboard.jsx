const Dashboard = () => {
  const stats = [
    { label: "Visitors", value: 1 },
    { label: "Chats", value: 2 },
    { label: "Total Chats", value: 0 },
    { label: "Agents Online", value: 2 },
    { label: "Goals", value: 0 },
  ];

  return (
    <div className="dashboard-grid">
      {stats.map((item, i) => (
        <div key={i} className="dash-card zoom-in">
          <p>{item.label}</p>
          <h1>{item.value}</h1>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
