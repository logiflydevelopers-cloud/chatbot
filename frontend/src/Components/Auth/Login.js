import { useForm } from "react-hook-form";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import GoogleButton from "react-google-button";

/* Images */
import desktopImg from "../../image/robot-desktop.png";
import mobileImg from "../../image/robot-mobile.png";
import emailIcon from "../../image/mail.svg";
import passwordIcon from "../../image/locked-computer.svg";

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
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
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
    <div className="pageWrapper">
      <div className="loginCard">

        {/* LEFT WHITE SIDE */}
        <div className="leftSide">
          <img src={desktopImg} className="robotDesktop" alt="Robot" />
          <img src={mobileImg} className="robotMobile" alt="Robot" />
        </div>

        {/* RIGHT BLUE SIDE */}
        <div className="rightSide">
          <form className="authForm" onSubmit={handleSubmit(onSubmit)}>

            {/* <h2 className="authTitle">Log In</h2> */}

            {/* EMAIL */}
            <div className="inputGroup iconInput">
              <img src={emailIcon} className="inputIcon" alt="email" />
              <input
                type="email"
                placeholder="Your email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="error">{errors.email.message}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="inputGroup iconInput">
              <img src={passwordIcon} className="inputIcon" alt="password" />
              <input
                type="password"
                placeholder="Password"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="error">{errors.password.message}</p>
              )}
            </div>

            <p className="forgot">
              <Link to="/forgot-password">Forgot password?</Link>
            </p>

            <button className="submitButton">Log In</button>

            <div className="or">or</div>

            <GoogleButton onClick={googleLogin} style={{ width: "100%" }} />

            <p className="toggleText">
              Don’t have an account? <Link to="/register">Sign Up</Link>
            </p>

          </form>
        </div>

      </div>
    </div>
  );
};

export default Login;
