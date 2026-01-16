import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

/* Images (Login page same) */
import desktopImg from "../../image/robot-desktop.png";
import mobileImg from "../../image/robot-mobile.png";
import otpIcon from "../../image/locked-computer.svg"; // same icon reuse

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("fp-email");

  const verify = async () => {
    try {
      const res = await axios.post("https://chatbot-backend-project.vercel.app/api/auth/verify-otp", {
        email,
        otp,
      });

      if (res.data.success) {
        navigate("/reset-password");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
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

            <h2 className="authTitle">Verify OTP</h2>

            {/* OTP INPUT */}
            <div className="inputGroup iconInput">
              <img src={otpIcon} className="inputIcon" alt="otp" />
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <button
              className="submitButton"
              type="button"
              onClick={verify}
            >
              Verify OTP
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};

export default VerifyOTP;
