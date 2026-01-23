import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";
import { MdVideoCall } from "react-icons/md";
import { useState } from "react";
import HomeHeader from "../Layout/HomeHeader";
import Footer from "./Footer/Footer";
import axios from "axios";
import "./ContactSupport.css";
import contactcall from "../image/contactfrom-call.jpg";

export default function ContactSupport() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
        link: "",
        file: null,
    });

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setForm({
            ...form,
            [name]: type === "file" ? files[0] : value,
        });
    };

    const submitForm = async (e) => {
        e.preventDefault();

        const data = new FormData();
        Object.keys(form).forEach((k) => {
            if (form[k]) data.append(k, form[k]);
        });

        try {
            await axios.post(
                "http://localhost:4000/api/contact",
                data,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            alert("✅ Support ticket sent to admin email");
        } catch (err) {
            console.error(err);
            alert("❌ Failed to send support ticket");
        }
    };

    return (
        <>
            <HomeHeader />

            {/* HERO */}
            <section className="cs-hero cs-fade">
                <h1>Contact SellChats Support</h1>
                <p>Our customer support team is available 24/7</p>
            </section>

            <section className="container cs-container">
                {/* LEFT */}
                <aside className="cs-left cs-slide-left">

                    <h3 className="cs-title">Ask Your Question</h3>

                    <div className="cs-card">
                        <span>Average Response Time</span>
                        <strong>30 Minutes</strong>
                    </div>

                    <div className="cs-card cs-purple cs-agent-card">
                        <h4 className="cs-agent-title">
                            ✨ Support AI Agent
                        </h4>

                        <h2 className="cs-agent-number">
                            <a href="tel:+14156343883">+1 415 634 3883</a>
                        </h2>

                        <p className="cs-agent-sub">
                            Our AI agent is here to help!
                        </p>

                        <div className="cs-agent-buttons">
                            <a
                                href="https://wa.me/14156343883"
                                target="_blank"
                                rel="noreferrer"
                                className="cs-btn cs-whatsapp"
                            >
                                <FaWhatsapp />
                                Whatsapp
                            </a>


                            <a
                                href="https://zoom.us"
                                target="_blank"
                                rel="noreferrer"
                                className="cs-btn cs-zoom"
                            >
                                <MdVideoCall />
                                Zoom
                            </a>

                            <a
                                href="tel:+14156343883"
                                className="cs-btn cs-phone"
                            >
                                <FaPhoneAlt />
                                Phone
                            </a>
                        </div>
                    </div>

                    {/* ENTERPRISE */}
                    <div className="cs-enterprise">
                        <a href="tel:+14156343883">
                            <img
                                src={contactcall}
                                alt="Enterprise"
                                className="cs-enterprise-img"
                            />
                        </a>
                    </div>

                </aside>

                {/* RIGHT */}
                <div className="cs-right cs-slide-right">
                    <h2 className="cd-right-title">How can we help?</h2>

                    <form onSubmit={submitForm}>
                        <div className="cs-row">
                            <input name="name" placeholder="Your Name" required onChange={handleChange} />
                            <input name="email" placeholder="Your Email Address" required onChange={handleChange} />
                        </div>

                        <input
                            name="subject"
                            placeholder="e.g., How can I create a successful survey form?"
                            required
                            onChange={handleChange}
                        />

                        <textarea
                            name="message"
                            placeholder="Describe your issue..."
                            required
                            onChange={handleChange}
                        />

                        <p className="cs-right-label">Add a Link</p>
                        <label className="cs-right-label-des">Please provide more details by including a page link and/or uploading a screenshot.</label>

                        <input
                            name="link"
                            placeholder="http://www.domain.com/contact.html"
                            onChange={handleChange}
                        />

                        <p className="cs-right-label">Upload a Screenshot</p>
                        <input type="file" name="file" onChange={handleChange} />

                        <button className="cs-submit">Post Question</button>
                    </form>
                </div>
            </section>

            {/* FOOTER */}
            <Footer />
        </>
    );
}
