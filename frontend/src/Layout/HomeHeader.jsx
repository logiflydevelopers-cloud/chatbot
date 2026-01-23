// src/Layout/HomeHeader.jsx
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import "./HomeHeader.css";

import logo from "../image/SellChat Logo.png";
import WordPress from "../image/WordPress-header.svg";
import Shopify from "../image/Shopify-header.svg";
import Wix from "../image/Wix-header.svg";
import GoDaddy from "../image/GoDaddy-header.svg";
import Framer from "../image/Framer-header.svg";
import Blogger from "../image/Blogger-header.svg";
import Google from "../image/Google-header.svg";
import Joomla from "../image/Joomla-header.svg";

export default function HomeHeader() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileSupportOpen, setMobileSupportOpen] = useState(false);
    const [mobileIntegrationsOpen, setMobileIntegrationsOpen] = useState(false);

    return (
        <>
            {/* NAVBAR */}
            <header className="navbar">
                <div className="container navbar-inner">
                    <div className="nav-left">
                        <img src={logo} alt="Logo" className="nav-logo" />
                    </div>

                    {/* DESKTOP NAV */}
                    <nav className="nav-pill">
                        <NavLink to="/" end>Home</NavLink>

                        <div className="nav-item integrations-dropdown">
                            <span className="nav-link">
                                Integrations
                                <FiChevronDown className="nav-arrow-icon" />
                            </span>

                            <div className="integrations-menu">
                                <div className="integrations-grid">
                                    {[WordPress, Shopify, Wix, GoDaddy, Framer, Blogger, Google, Joomla].map(
                                        (img, i) => (
                                            <div className="integration-item" key={i}>
                                                <img src={img} alt="integration" />
                                                <span>
                                                    {["WordPress","Shopify","Wix","GoDaddy","Framer","Blogger","Google","Joomla"][i]}
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>

                        <NavLink to="/pricing">Pricing</NavLink>
                        <NavLink to="/blog">Blog</NavLink>

                        <div className="nav-item support-dropdown">
                            <span className="nav-link">
                                Support
                                <FiChevronDown className="nav-arrow-icon" />
                            </span>

                            <div className="dropdown-menu">
                                <NavLink to="/contact-support">Contact Support</NavLink>
                                <NavLink to="/contact-support">Help Center</NavLink>
                                <NavLink to="/faq">FAQ</NavLink>
                            </div>
                        </div>
                    </nav>

                    <div className="nav-right">
                        <Link to="/login" className="login-btn">Login</Link>
                        <Link to="/register" className="signup-btn">Sign up</Link>
                    </div>

                    <div className="hamburger" onClick={() => setMenuOpen(true)}>☰</div>
                </div>
            </header>

            {/* MOBILE OVERLAY */}
            <div
                className={`mobile-overlay ${menuOpen ? "show" : ""}`}
                onClick={() => setMenuOpen(false)}
            />

            {/* MOBILE MENU */}
            <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
                <div className="mobile-header">
                    <span>Menu</span>
                    <span className="close" onClick={() => setMenuOpen(false)}>✕</span>
                </div>

                <ul className="mobile-nav-list">
                    <li>
                        <NavLink to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink>
                    </li>

                    {/* SUPPORT */}
                    <li className={`mobile-support ${mobileSupportOpen ? "open" : ""}`}>
                        <div
                            className="mobile-support-header"
                            onClick={() => {
                                setMobileSupportOpen(!mobileSupportOpen);
                                setMobileIntegrationsOpen(false);
                            }}
                        >
                            <span>Support</span>
                            <FiChevronDown className="mobile-arrow-icon" />
                        </div>

                        <div className="mobile-support-dropdown">
                            <Link to="/contact-support">Contact Support</Link>
                            <Link to="/help-center">Help Center</Link>
                            <Link to="/faq">FAQ</Link>
                        </div>
                    </li>

                    {/* INTEGRATIONS */}
                    <li className={`mobile-integrations ${mobileIntegrationsOpen ? "open" : ""}`}>
                        <div
                            className="mobile-support-header"
                            onClick={() => {
                                setMobileIntegrationsOpen(!mobileIntegrationsOpen);
                                setMobileSupportOpen(false);
                            }}
                        >
                            <span>Integrations</span>
                            <FiChevronDown className="mobile-arrow-icon" />
                        </div>

                        <div className="mobile-integrations-dropdown">
                            {[WordPress, Shopify, Wix, GoDaddy, Framer, Blogger, Google, Joomla].map(
                                (img, i) => (
                                    <div className="mobile-integration-item" key={i}>
                                        <img src={img} alt="integration" />
                                        <span>
                                            {["WordPress","Shopify","Wix","GoDaddy","Framer","Blogger","Google","Joomla"][i]}
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                    </li>

                    <li>Pricing</li>
                    <li>Blog</li>
                </ul>

                <div className="mobile-actions">
                    <Link to="/login" className="login-btn">Login</Link>
                    <Link to="/register" className="mobile-signup">Sign up</Link>
                </div>
            </div>
        </>
    );
}
