import { useNavigate } from "react-router-dom";

const Customers = () => {
  const navigate = useNavigate();

  const customers = [
    {
      id: "cst_101",
      name: "John Doe",
      email: "john@gmail.com",
    },
    {
      id: "cst_102",
      name: "Jane Smith",
      email: "jane@gmail.com",
    },
  ];

  return (
    <div className="customer-list">
      {customers.map((c) => (
        <div
          key={c.id}
          className="customer-card"
          onClick={() => navigate(`/admin/customers/${c.id}`)}
        >
          <h4>{c.name}</h4>
          <p>ID: {c.id}</p>
          <p>{c.email}</p>
        </div>
      ))}
    </div>
  );
};

export default Customers;
