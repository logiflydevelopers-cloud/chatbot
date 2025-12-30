import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleSuccess = ({ setUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");
    const userParam = params.get("user");

    if (!token || !userParam) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(decodeURIComponent(userParam));

    // ✅ Same as normal login
    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(user));

    setUser(user);

    // ✅ SAME dashboard route as normal login
    navigate("/dashboard/train", { replace: true });
  }, [navigate, setUser]);

  return (
    <h2 style={{ textAlign: "center", marginTop: "50px" }}>
      Logging in with Google...
    </h2>
  );
};

export default GoogleSuccess;
