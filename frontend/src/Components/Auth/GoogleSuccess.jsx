import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GoogleSuccess = ({ setUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    // ✅ Save token
    localStorage.setItem("accessToken", token);

    // ✅ FETCH USER & SET STATE (MOST IMPORTANT)
    axios
      .get("https://chatbot-backend-project.vercel.app/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data));
        setUser(res.data);

        // ✅ NOW SAFE TO GO DASHBOARD
        navigate("/dashboard/train", { replace: true });
      })
      .catch(() => {
        navigate("/login");
      });
  }, [navigate, setUser]);

  return (
    <h2 style={{ textAlign: "center", marginTop: "50px" }}>
      Logging in with Google... please wait...
    </h2>
  );
};

export default GoogleSuccess;
