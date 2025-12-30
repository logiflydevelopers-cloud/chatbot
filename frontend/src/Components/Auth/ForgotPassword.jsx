import { useState } from "react";
import axios from "axios";
import styles from "./Auth.module.css";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const sendOTP = async () => {
    try {
      await axios.post("https://chatbot-backend-project.vercel.app/api/auth/forgot-password", {
        email,
      });

      localStorage.setItem("fp-email", email);
      navigate("/verify-otp");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authForm}>
        <h2 className={styles.authTitle}>Forgot Password</h2>

        <label>Email</label>
        <input
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className={styles.submitButton} onClick={sendOTP}>
          Send OTP
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
