import { useState } from "react";
import axios from "axios";
import styles from "./Auth.module.css";
import { useNavigate } from "react-router-dom";

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
      alert("Failed to reset password");
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authForm}>
        <h2 className={styles.authTitle}>Reset Password</h2>

        <label>New Password</label>
        <input
          type="password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className={styles.submitButton} onClick={reset}>
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
