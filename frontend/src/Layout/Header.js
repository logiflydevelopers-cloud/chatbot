import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import { FaUserCircle } from "react-icons/fa";

function Header({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // Clear token
    setUser(null);                           // Clear App.js state
    navigate("/login");                       // Redirect to login page
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Home</Link>
      </div>

      <nav className="nav">
        {user ? (
          <div className="user-info">
            <FaUserCircle
              size={24}
              style={{ verticalAlign: "middle", marginRight: "5px", cursor: "pointer" }}
              title="View Profile"
              onClick={() => navigate("/userDetails")}
            />
            <span
              style={{ marginRight: "15px", cursor: "pointer", fontWeight: "500" }}
              onClick={() => navigate("/userDetails")}
            >
              {user.name}
            </span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
