import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

const GoogleSuccess = ({ setUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    localStorage.setItem("accessToken", token);

    const decoded = jwtDecode(token);

    const user = {
      id: decoded.userId,
    };

    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);

    navigate("/dashboard/train", { replace: true });
  }, [navigate, setUser]);

  return <h3 style={{ textAlign: "center" }}>Logging in with Google...</h3>;
};

export default GoogleSuccess;
