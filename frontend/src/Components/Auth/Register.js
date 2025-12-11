import { useForm } from 'react-hook-form';
import styles from './Auth.module.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
        "https://backend-demo-chatbot.vercel.app/api/auth/register",
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
    <div className={styles.authContainer}>
      <form className={styles.authForm} onSubmit={handleSubmit(onSubmit)}>
        <h2 className={styles.authTitle}>Create an account</h2>

        <div className={styles.inputGroup}>
          <label>Full Name</label>
          <input
            type="text"
            className={styles.input}
            {...register('name', {
              required: 'Name is required',
              minLength: {
                value: 3,
                message: 'Name must be at least 3 characters',
              },
            })}
          />
          {errors.name && <div className={styles.error}>{errors.name.message}</div>}
        </div>

        <div className={styles.inputGroup}>
          <label>Email</label>
          <input
            type="email"
            className={styles.input}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email format',
              },
            })}
          />
          {errors.email && <div className={styles.error}>{errors.email.message}</div>}
        </div>

        <div className={styles.inputGroup}>
          <label>Password</label>
          <input
            type="password"
            className={styles.input}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
          />
          {errors.password && <div className={styles.error}>{errors.password.message}</div>}
        </div>

        <button type="submit" className={styles.submitButton}>
          Register
        </button>

        <p className={styles.toggleText}>
          Already have an account?{" "}
          <Link to="/login" className={styles.toggleLink}>Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
