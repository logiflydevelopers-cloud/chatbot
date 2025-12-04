import { Link } from "react-router-dom";
import "./Home.css";
import logo from "../image/logo.png";


;

function Home() {
  return (
    <>
      {/* NAVBAR */}
      <header className="home-header">
        <div className="home-left">
          <img src={logo} className="home-logo" alt="logo" />
          <span className="brand-text">AI Agent Builder</span>
        </div>

        <nav className="home-nav">
          <a href="#">My Workspace</a>
          <a href="#">Templates</a>
          <a href="#">Integrations</a>
          <a href="#">Products</a>
          <a href="#">Support</a>
          <a href="#">Pricing</a>
        </nav>

        <div className="home-right">
          <Link to="/login" className="home-login-btn">Login</Link>
          <Link to="/register" className="home-signup-btn">Sign Up for Free</Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero">
        <h4 className="hero-subtitle">EASIEST AI BUILDER</h4>
        <h1 className="hero-title">Build Powerful AI Assistants</h1>
        <p className="hero-desc">
          Create smart AI agents that learn, respond, personalize, and help automate
          your entire business with zero coding.
        </p>

        {/* SIGNUP BOX */}
        <div className="signup-box">
          <Link to="/login" className="google-btn">Sign In with Google</Link>
          <Link to="/login" className="microsoft-btn">Sign In with Microsoft</Link>

          <div className="divider">OR</div>

          <Link to="/register" className="email-btn">Sign Up with Email</Link>
        </div>
      </section>
    </>
  );
}

export default Home;
