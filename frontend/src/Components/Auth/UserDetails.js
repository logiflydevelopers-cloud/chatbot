import { useEffect, useState } from "react";
import styles from "./Auth.module.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UserDetails = ({ user, setUser }) => {
  const navigate = useNavigate();
  const { userId } = useParams(); // 🔥 Read user ID from URL

  const [loading, setLoading] = useState(true);

  // Fetch specific user details by ID
  const fetchUserDetails = async (token) => {
    return await axios.get(
      `http://localhost:4000/api/auth/getUserDetails/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );
  };

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetchUserDetails(token);
        setUser(res.data); // Update in App.js
        setLoading(false);
      } catch (error) {
        const status = error?.response?.status;

        if (status === 401 || status === 403) {
          try {
            console.log("Access token expired. Refreshing...");
            const refreshRes = await axios.get(
              "http://localhost:4000/api/auth/refresh",
              { withCredentials: true }
            );

            const newAccessToken = refreshRes.data.accessToken;
            localStorage.setItem("accessToken", newAccessToken);

            const retryRes = await fetchUserDetails(newAccessToken);
            setUser(retryRes.data);

          } catch (refreshError) {
            console.log("Refresh token expired");
            localStorage.clear();
            setUser(null);
            navigate("/login");
          }
        }
      }

      setLoading(false);
    };

    loadUser();
  }, [navigate, userId, setUser]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:4000/api/user/logout",
        {},
        { withCredentials: true }
      );

      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      if (setUser) setUser(null); // FIXED

      alert("Logout successful");
      navigate("/login");

    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };


  if (loading || !user) return <p>Loading user info...</p>;

  return (
    <div className={styles.authContainer}>
      <div className={styles.authForm}>
        <h2 className={styles.authTitle}>User Details</h2>

        <p>
          <strong>Name:</strong> {user.name || "Not provided"}
        </p>

        <p>
          <strong>Email:</strong> {user.email}
        </p>

        <p>
          <strong>Mobile:</strong> {user.mobile || "Not provided"}
        </p>

        <button onClick={handleLogout} className={styles.submitButton}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserDetails;
