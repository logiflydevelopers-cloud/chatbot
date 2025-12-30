import { useState } from "react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import "./Home.css";
import { Link } from "react-router-dom";
import chatUI from "../image/yiguyh 1.png";
import googleIcon from "../image/google.png";
import gmailIcon from "../image/gmail.png";
import companiesDesktop from "../image/companies-desktop.png";
import companiesMobile from "../image/companies-mobile.png";
import integrationsCard from "../image/integrations-card.png";
import integrationsRow from "../image/integrations-row.png";
import knowledgeImage from "../image/chat-upload.png";
import customizationImage from "../image/feature-customization.png";
import firstMessageImage from "../image/feature-first-message.png";
import conversationImage from "../image/feature-conversations.png";
import languageImage from "../image/feature-language.png";
import iconLaunch from "../image/Group 33.png";
import iconLanguage from "../image/Group 34.png";
import iconInbox from "../image/Group 35.png";
import iconFree from "../image/Group 36.png";
import avatar1 from "../image/avatar-1.png";
import avatar2 from "../image/avatar-2.png";
import avatar3 from "../image/avatar-3.png";
import badge20k from "../image/badge-20k.png";
import guaranteeBadge from "../image/money-back.png";
import starIcon from "../image/Vector.png";
import arrowDownIcon from "../image/arrow-down-sign-to-navigate.png";

// import calendarIcon from "../image/calendar.png";
// import chatIcon from "../image/chat.png";
// import headsetIcon from "../image/headset.png";
// import shopIcon from "../image/shop.png";
// import botIcon from "../image/bot.png";
import liveChatIcon from "../image/Group 41.png";
import helpDeskIcon from "../image/Group 42.png";
import knowledgeBaseIcon from "../image/Group 43.png";
import openWidgetIcon from "../image/Group 44.png";
import shopIcon from "../image/Group.png";
import calendarIcon from "../image/Group (1).png";
import chatIcon from "../image/LiveChat-Logo-Orange-White-Stacked 1.png";
import headsetIcon from "../image/Stacked_RGB_Green 1.png";
import headsetIcon1 from "../image/zendesk_logo_icon_147198 1.png";
import botIcon from "../image/image 65.png";
import checkIcon from "../image/right-arrow.png";





/* REVIEWS DATA */
const reviews = [
  {
    title: "Great Product 👍",
    text: "Every day I impress my friends and coworkers with AI skills. Seriously, it’s a game-changer.",
    name: "Linaa Marcel",
    date: "@linaa7894 · Jun 2025",
    avatar: avatar3,
  },
  {
    title: "Amazing Experience",
    text: "Setup was insanely easy. Within minutes my site had a smart chatbot.",
    name: "Rahul Mehta",
    date: "@rahulm · May 2025",
    avatar: avatar1,
  },
  {
    title: "Highly Recommended",
    text: "It reduced our support tickets drastically. Customers love it.",
    name: "Emily Carter",
    date: "@emilyc · Apr 2025",
    avatar: avatar2,
  },
  {
    title: "Best AI Tool",
    text: "Hands down the best AI chatbot solution I’ve tried so far.",
    name: "Daniel Wong",
    date: "@danw · Mar 2025",
    avatar: avatar1,
  },
  {
    title: "Worth Every Minute",
    text: "Clean UI, fast setup, and powerful responses. Love this product.",
    name: "Sophia Lee",
    date: "@sophial · Feb 2025",
    avatar: avatar3,
  },
];

const googleLogin = async () => {
  try {
    const res = await axios.get("http://localhost:4000/api/auth/google");
    window.location.href = res.data.url; // 🔥 direct Google login
  } catch (err) {
    console.error("Google login failed", err);
  }
};

function FAQAccordion() {
  const [activeId, setActiveId] = useState(null);

  const leftFaqs = [
    {
      id: "l1",
      q: "Can I test ChatBot for free?",
      a: "Yes, you can try ChatBot for free with limited features."
    },
    {
      id: "l2",
      q: "Are technical skills required?",
      a: "No, anyone can set it up easily."
    },
    {
      id: "l3",
      q: "Can ChatBot be integrated with LiveChat?",
      a: "Yes, ChatBot integrates smoothly with LiveChat tools."
    },
    {
      id: "l4",
      q: "What is a chatbot?",
      a: "A chatbot is software that chats with users automatically."
    }
  ];

  const rightFaqs = [
    {
      id: "r1",
      q: "Does installing ChatBot require coding?",
      a: "No coding is required. Just copy-paste the script."
    },
    {
      id: "r2",
      q: "What is a generative AI chatbot?",
      a: "It uses AI models to generate smart replies."
    },
    {
      id: "r3",
      q: "Can one chatbot work on multiple channels?",
      a: "Yes, one bot can serve website, WhatsApp and more."
    },
    {
      id: "r4",
      q: "How does a generative AI chatbot work?",
      a: "It learns from data and responds intelligently."
    }
  ];

  const toggleFAQ = (id) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <div className="faq-grid">
      {/* LEFT COLUMN */}
      <div className="faq-col">
        {leftFaqs.map((item) => (
          <FAQItem
            key={item.id}
            item={item}
            isOpen={activeId === item.id}
            onClick={() => toggleFAQ(item.id)}
          />
        ))}
      </div>

      {/* RIGHT COLUMN */}
      <div className="faq-col">
        {rightFaqs.map((item) => (
          <FAQItem
            key={item.id}
            item={item}
            isOpen={activeId === item.id}
            onClick={() => toggleFAQ(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

function FAQItem({ item, isOpen, onClick }) {
  return (
    <div className={`faq-item ${isOpen ? "open" : ""}`}>
      <button className="faq-question" onClick={onClick}>
        {item.q}
        <span className="faq-arrow">
          <img src={arrowDownIcon} alt="arrow" />
        </span>
      </button>


      <div
        className="faq-answer-wrapper"
        style={{
          maxHeight: isOpen ? "160px" : "0px"
        }}
      >
        <div className="faq-answer">{item.a}</div>
      </div>
    </div>
  );
}



export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const elements = document.querySelectorAll(".animate");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target); // 🔥 KEY LINE
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -120px 0px",
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);


  const toolItems = [
    { text: "Show products", icon: shopIcon },
    { text: "Create meeting", icon: calendarIcon },
    { text: "Transfer to live agent", icon: chatIcon },
    { text: "Create support ticket", icon: headsetIcon },
    { text: "Create support ticket", icon: headsetIcon1 },
  ];


  const [toolIndex, setToolIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setToolIndex((prev) => (prev + 1) % toolItems.length);
    }, 3200); // ⏱ smooth + premium speed

    return () => clearInterval(interval);
  }, []);






  return (
    <>
      {/* NAVBAR */}
      <header className="navbar">
        <div className="container navbar-inner">

          {/* LEFT */}
          <div className="nav-left">
            <div className="logo-box">⌘</div>
            <span className="logo-text">ChatAI</span>
          </div>

          {/* CENTER (DESKTOP) */}
          <nav className="nav-pill">
            <a className="active" href="#">Prompts</a>
            <a href="#">Tools</a>
            <a href="#">Product</a>
            <a href="#">Pricing</a>
            <a href="#">Contact Us</a>
            <a href="#">Blog</a>
          </nav>

          {/* RIGHT (DESKTOP) */}
          <div className="nav-right">
            <Link to="/login" className="login-btn">Login</Link>
            <Link to="/register" className="signup-btn">Sign up</Link>
          </div>


          {/* MOBILE ICON */}
          <div className="hamburger" onClick={() => setMenuOpen(true)}>
            ☰
          </div>
        </div>
      </header>

      {/* MOBILE OVERLAY */}
      <div
        className={`mobile-overlay ${menuOpen ? "show" : ""}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* MOBILE RIGHT MENU */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="mobile-header">
          <span>Menu</span>
          <span className="close" onClick={() => setMenuOpen(false)}>✕</span>
        </div>

        <ul>
          <li>Prompts</li>
          <li>Tools</li>
          <li>Product</li>
          <li>Pricing</li>
          <li>Contact Us</li>
          <li>Blog</li>
        </ul>

        <div className="mobile-actions">
          <Link to="/login" className="login-btn">Login</Link>
          <Link to="/register" className="mobile-signup">Sign up</Link>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="container hero-inner">

          {/* LEFT CONTENT */}
          <div className="animate hero-left fade-left">
            <h1>
              AI Chatbot for <br /> your site
            </h1>

            <p>
              AI chatbot instantly learns from your website and uses that
              knowledge to answer visitor questions — automatically.
            </p>

            <div className="hero-buttons">
              <button className="btn-google" onClick={googleLogin}>
                <img src={googleIcon} alt="Google" className="btn-icon" />
                Sign Up with Google →
              </button>


              <button
                className="btn-email"
                onClick={() => navigate("/register")}
              >
                <img src={gmailIcon} alt="Email" className="btn-icon" />
                Sign Up with an Email →
              </button>


            </div>

            <div className="btn-buttom"><small>It’s free. No credit card required.</small></div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="hero-right animate fade-right delay-1">
            <img
              src={chatUI}
              alt="AI Chat UI"
              className="hero-image"
            />

          </div>

        </div>
      </section>

      {/* TRUSTED COMPANIES SECTION */}
      <section className="companies">
        <div className="container companies-inner animate fade-up">

          <p className="companies-text">
            Empowering thousands of companies.{" "}
            <span>Join them</span>
          </p>

          {/* DESKTOP IMAGE */}
          <img
            src={companiesDesktop}
            alt="Trusted companies"
            className="companies-image desktop-only"
          />

          {/* MOBILE IMAGE */}
          <img
            src={companiesMobile}
            alt="Trusted companies"
            className="companies-image mobile-only"
          />

        </div>
      </section>


      {/* KEY FEATURES SECTION */}
      {/* ALL FEATURES SECTION */}
      <section className="features">
        <div className="container">

          {/* HEADER */}
          <div className="features-header animate fade-up">
            <h2>
              Key features that <span>power your business</span>
            </h2>
            <p>
              ChatBot is packed with customer service–ready features designed to
              reduce support workload while improving customer experience.
            </p>
          </div>

          {/* 1 */}
          <div className="feature-row">
            <div className="feature-media animate fade-left">
              <img src={integrationsCard} alt="Integrations" />
            </div>
            <div className="feature-content animate fade-right delay-1">
              <img src={integrationsRow} className="feature-icons" />
              <h3>Instant setup, no coding required</h3>
              <p>
                Grab your embed code and drop it into your site. That’s all
                Noupe needs to get to work.
              </p>
            </div>
          </div>

          {/* 2 */}
          <div className="feature-row reverse">
            <div className="feature-media animate fade-right">
              <img src={knowledgeImage} alt="Knowledge Base" />
            </div>
            <div className="feature-content animate fade-left delay-1">
              <h3>Knowledge Base</h3>
              <p>
                Train ChatBot with your own content. Add documents and Q&A so
                your Noupe can answer with your knowledge.
              </p>
            </div>
          </div>

          {/* 3 */}
          <div className="feature-row">
            <div className="feature-media animate fade-left">
              <img src={customizationImage} alt="Customization Options" />
            </div>
            <div className="feature-content animate fade-right delay-1">
              <h3>Customization Options</h3>
              <p>
                Make ChatBot fit your site. Adjust size, alignment, color and
                avatar for a seamless look.
              </p>
            </div>
          </div>

          {/* 4 */}
          <div className="feature-row reverse">
            <div className="feature-media animate fade-right">
              <img src={firstMessageImage} alt="First Message" />
            </div>
            <div className="feature-content animate fade-left">
              <h3>First Message</h3>
              <p>
                Decide what your chatbot says first and welcome customers
                instantly.
              </p>
            </div>
          </div>

          {/* 5 */}
          <div className="feature-row">
            <div className="feature-media animate fade-left">
              <img src={conversationImage} alt="Get conversations" />
            </div>
            <div className="feature-content animate fade-right">
              <h3>Get conversations</h3>
              <p>
                Every conversation is sent to your inbox in real time so you can
                follow up fast.
              </p>
            </div>
          </div>

          {/* 6 */}
          <div className="feature-row reverse">
            <div className="feature-media animate fade-right">
              <img src={languageImage} alt="Multi-language support" />
            </div>
            <div className="feature-content animate fade-left">
              <h3>Multi-language support</h3>
              <p>
                ChatBot detects each visitor’s language and answers automatically.
              </p>
            </div>
          </div>

        </div>
      </section>




      {/* WHY WILL LOVE CHATBOT */}
      <section className="why-love">
        <div className="container">

          <div className="why-header animate fade-up">
            <h2>Why will love ChatBot</h2>
            <p>
              ChatBot is the easiest way to deliver automated customer support using AI.
              Just enter your website URL, and ChatBot AI builds a chatbot that
              understands your business.
            </p>
          </div>

          <div className="why-list">

            <div className="why-pill animate fade-left left">
              <div className="why-icon">
                <img src={iconLaunch} alt="Launch fast" />
              </div>
              <span>Launches in minutes — no code, no training</span>
            </div>

            <div className="why-pill animate fade-right right">
              <span>Works in every language, on any website</span>
              <div className="why-icon">
                <img src={iconLanguage} alt="Languages" />
              </div>
            </div>

            <div className="why-pill animate fade-left left">
              <div className="why-icon">
                <img src={iconInbox} alt="Inbox" />
              </div>
              <span>Sends conversations directly to your inbox</span>
            </div>

            <div className="why-pill animate fade-right right">
              <span>100% free until 2026</span>
              <div className="why-icon">
                <img src={iconFree} alt="Free" />
              </div>
            </div>

          </div>
        </div>
      </section>



      {/* =========================
    TESTIMONIALS SECTION
========================= */}
      <section className="testimonials">
        <div className="container">

          {/* HEADER */}
          <div className="testimonials-header animate fade-up">
            <h2>Join our AI-delighted customers</h2>

            <div className="testimonials-meta">
              <div className="rating">
                <div className="stars-row">
                  {[...Array(5)].map((_, i) => (
                    <img key={i} src={starIcon} alt="star" />
                  ))}
                </div>

                <span>4.8 out of 5 based on<br />743 reviews</span>
              </div>


              <div className="customers">
                <div className="avatars">
                  <img src={avatar1} alt="Customer" />
                  <img src={avatar2} alt="Customer" />
                  <img src={avatar3} alt="Customer" />
                  <img src={badge20k} alt="20K+" className="badge" />
                </div>
                <span>17,060+ customers</span>
              </div>
            </div>
          </div>

          {/* SLIDER */}
          <div className="testimonial-slider">
            <div className="testimonial-track">

              {[...reviews, ...reviews].map((r, i) => (
                <div className="testimonial-card animate fade-up" key={i}>
                  <div className="stars-row">
                    {[...Array(5)].map((_, i) => (
                      <img key={i} src={starIcon} alt="star" />
                    ))}
                  </div>

                  <h4 className="testimonial-title">{r.title}</h4>
                  <p className="testimonial-des">{r.text}</p>

                  <div className="author">
                    <img src={r.avatar} alt={r.name} />
                    <div>
                      <strong className="testimonial-author">{r.name}</strong>
                      <span className="testimonial-date">{r.date}</span>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>

        </div>
      </section>



      {/* GUARANTEE SECTION */}
      <section className="guarantee">
        <div className="container guarantee-inner">

          <h2 className="guarantee-title animate fade-up">
            7-Day Risk-Free Guarantee
          </h2>

          <div className="guarantee-badge animate fade-up delay-1">
            <img src={guaranteeBadge} alt="100% Money Back Guarantee" />
          </div>

          <p className="guarantee-text animate fade-up delay-2">
            If for any reason you are not satisfied, you can request a full
            refund 7 days after purchase, no questions asked.
          </p>

        </div>
      </section>


      {/* CTA TRIAL SECTION */}
      <section className="cta-trial">
        <div className="container">

          <h2 className="cta-title animate fade-up">
            Get a free ChatBot trial <br />
            and become one of them
          </h2>

          <div className="cta-form animate fade-up delay-1">
            <input
              type="email"
              placeholder="Enter your business email"
            />
            <button>Sign Up free</button>
          </div>

          <div className="cta-points animate fade-up delay-2">
            <span className="cta-point">
              <img src={checkIcon} alt="check" />
              Free 7-day trial
            </span>

            <span className="cta-point">
              <img src={checkIcon} alt="check" />
              No credit card required
            </span>
          </div>


        </div>
      </section>




      <section className="tools-section">
        <h2 className="guarantee-title animate fade-up tools-label">
          Tools
        </h2>
        <div className="container tools-inner">

          {/* LEFT */}
          <div className="tools-left">

            <h2>
              Get more value from <br />
              your favorite tools
            </h2>

            <p>
              Enhance your AI chatbot with more features,
              workflows, and automations through plug-and-play integrations.
            </p>

            <button className="tools-btn">
              See all integrations →
            </button>
          </div>

          {/* RIGHT */}
          <div className="tools-right">

            {/* FIXED BOT ICON */}
            <div className="bot-icon">
              <img src={botIcon} alt="Bot" />
            </div>

            {/* DOTTED CONNECTOR */}
            <div className="bot-connector" />

            {[0, 1, 2, 3, 4].map((pos) => {
              const item =
                toolItems[
                (toolIndex + pos - 2 + toolItems.length) % toolItems.length
                ];

              const isCenter = pos === 2;

              return (
                <div
                  key={pos}
                  className={`tool-box b${pos + 1} ${isCenter ? "active" : ""}`}
                >
                  <img src={item.icon} alt={item.text} className="tool-icon" />
                  <span className="tool-text">{item.text}</span>
                </div>
              );
            })}
          </div>


        </div>
      </section>



      {/* =========================
        FAQ SECTION
========================= */}
      <section className="faq-section">
        <div className="container">
          <h2 className="faq-title animate fade-up">
            Frequently Asked Questions
          </h2>

          <FAQAccordion />
        </div>
      </section>



      {/* =========================
    PRODUCTS SECTION
========================= */}
      <section className="products-section">
        <div className="container">

          <h2 className="products-title">
            Discover our <span>text|</span> products
          </h2>

          <div className="products-grid">

            <div className="product-card">
              <img src={liveChatIcon} alt="LiveChat" />
              <div>
                <h4>LiveChat</h4>
                <p>Connect with customers</p>
              </div>
            </div>

            <div className="product-card">
              <img src={helpDeskIcon} alt="HelpDesk" />
              <div>
                <h4>HelpDesk</h4>
                <p>Support customers<br />with tickets</p>
              </div>
            </div>

            <div className="product-card">
              <img src={knowledgeBaseIcon} alt="KnowledgeBase" />
              <div>
                <h4>KnowledgeBase</h4>
                <p>Guide and educate<br />customers</p>
              </div>
            </div>

            <div className="product-card">
              <img src={openWidgetIcon} alt="OpenWidget" />
              <div>
                <h4>OpenWidget</h4>
                <p>Enhance websites<br />with widgets</p>
              </div>
            </div>

          </div>
        </div>
      </section>



    </>
  );
}




