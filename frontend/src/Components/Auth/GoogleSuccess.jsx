import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("accessToken", token);

      // Redirect to dashboard
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]); // ⭐ ADD navigate to remove warning

  return (
    <h2 style={{ textAlign: "center", marginTop: "50px" }}>
      Logging in with Google... please wait...
    </h2>
  );
};

export default GoogleSuccess;
