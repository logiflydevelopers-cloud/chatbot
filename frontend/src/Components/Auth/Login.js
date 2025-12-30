import { useForm } from "react-hook-form";
import styles from "./Auth.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import GoogleButton from "react-google-button";

const Login = ({ setUser }) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "https://chatbot-backend-project.vercel.app/api/auth/login",
        data,
        { withCredentials: true }
      );

      if (response.status === 200) {
        const { accessToken, user } = response.data;

        // ✅ Save auth
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user));

        // ✅ Update state
        setUser(user);

        // ✅ React-router navigation (NO reload)
        navigate("/dashboard/train", { replace: true });
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  const googleLogin = async () => {
    const res = await axios.get("https://chatbot-backend-project.vercel.app/api/auth/google");
    window.location.href = res.data.url;
  };

  return (
    <div className={styles.authContainer}>
      <form className={styles.authForm} onSubmit={handleSubmit(onSubmit)}>
        <h2 className={styles.authTitle}>Login to your account</h2>

        {/* EMAIL */}
        <div className={styles.inputGroup}>
          <label>Email</label>
          <input
            type="email"
            className={styles.input}
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <p className={styles.error}>{errors.email.message}</p>
          )}
        </div>

        {/* PASSWORD */}
        <div className={styles.inputGroup}>
          <label>Password</label>
          <input
            type="password"
            className={styles.input}
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <p className={styles.error}>{errors.password.message}</p>
          )}
        </div>

        <p style={{ textAlign: "right", marginTop: "-10px" }}>
          <Link to="/forgot-password" style={{ fontSize: 14 }}>
            Forgot Password?
          </Link>
        </p>

        <button type="submit" className={styles.submitButton}>
          Login
        </button>

        <GoogleButton
          onClick={googleLogin}
          style={{ width: "100%", marginTop: 15 }}
        />

        <p className={styles.toggleText}>
          Don't have an account?{" "}
          <Link to="/register" style={{ fontWeight: 600 }}>
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
