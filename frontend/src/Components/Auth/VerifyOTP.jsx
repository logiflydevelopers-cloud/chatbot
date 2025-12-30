import { useState } from "react";
import axios from "axios";
import styles from "./Auth.module.css";
import { useNavigate } from "react-router-dom";

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
      alert("Invalid OTP");
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authForm}>
        <h2 className={styles.authTitle}>Verify OTP</h2>

        <label>Enter OTP</label>
        <input
          className={styles.input}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button className={styles.submitButton} onClick={verify}>
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default VerifyOTP;
