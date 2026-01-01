import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Login.css";
import desktopImg from "../../image/robot-desktop.png";
import mobileImg from "../../image/robot-mobile.png";
import userIcon from "../../image/user.svg";
import emailIcon from "../../image/mail.svg";
import passwordIcon from "../../image/locked-computer.svg";

const Register = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/auth/register",
        data,
        { withCredentials: true }
      );

      if (response.status === 201) {
        alert("🎉 Registration successful!");
        navigate("/login");
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || "Registration failed");
      } else {
        alert("Unexpected error — try again.");
      }
    }
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
            <div className="inputGroup iconInput">
              <img src={userIcon} className="inputIcon" alt="full name" />
              <input
                type="text"
                placeholder='User Name'
                {...register('name', {
                  required: 'Name is required',
                  minLength: {
                    value: 3,
                    message: 'Name must be at least 3 characters',
                  },
                })}
              />
              {errors.name && <div >{errors.name.message}</div>}
            </div>

            {/* EMAIL */}
            <div className="inputGroup iconInput">
              <img src={emailIcon} className="inputIcon" alt="email" />
              <input
                type="email"
                placeholder="Your email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email format',
                  },
                })}
              />
              {errors.email && <div className="error">{errors.email.message}</div>}
            </div>


            {/* PASSWORD */}
            <div className="inputGroup iconInput">
              <img src={passwordIcon} className="inputIcon" alt="password" />
              <input
                type="password"
                placeholder="Password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
              {errors.password && <div className="error">{errors.password.message}</div>}
            </div>

            <button type="submit" className="submitButton">Register</button>

            <p className="toggleText">
              Already have an account?{" "} <Link to="/login" className="toggleLink">Login</Link>
            </p>

          </form>
        </div>

      </div>
    </div>
  );
};

export default Register;
