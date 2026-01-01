import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

/* Images (Login page same) */
import desktopImg from "../../image/robot-desktop.png";
import mobileImg from "../../image/robot-mobile.png";
import passwordIcon from "../../image/locked-computer.svg";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("fp-email");

  const reset = async () => {
    try {
      await axios.post("https://chatbot-backend-project.vercel.app/api/auth/reset-password", {
        email,
        password,
      });

      alert("Password reset successful");
      localStorage.removeItem("fp-email");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="pageWrapper">
      <div className="loginCard">

        {/* LEFT SIDE */}
        <div className="leftSide">
          <img src={desktopImg} className="robotDesktop" alt="Robot" />
          <img src={mobileImg} className="robotMobile" alt="Robot" />
        </div>

        {/* RIGHT SIDE */}
        <div className="rightSide">
          <div className="authForm">

            <h2 className="authTitle">Reset Password</h2>

            {/* PASSWORD */}
            <div className="inputGroup iconInput">
              <img
                src={passwordIcon}
                className="inputIcon"
                alt="password"
              />
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              className="submitButton"
              type="button"
              onClick={reset}
            >
              Reset Password
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;
