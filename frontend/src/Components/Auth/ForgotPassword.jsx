import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

/* Images (Login page same) */
import desktopImg from "../../image/robot-desktop.png";
import mobileImg from "../../image/robot-mobile.png";
import emailIcon from "../../image/email.svg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const sendOTP = async () => {
    try {
      await axios.post("http://localhost:4000/api/auth/forgot-password", {
        email,
      });

      localStorage.setItem("fp-email", email);
      navigate("/verify-otp");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
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

            <h2 className="authTitle">Forgot Password</h2>

            {/* EMAIL */}
            <div className="inputGroup iconInput">
              <img src={emailIcon} className="inputIcon" alt="email" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              className="submitButton"
              type="button"
              onClick={sendOTP}
            >
              Send OTP
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
