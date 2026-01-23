import HomeHeader from "./HomeHeader";
import Footer from "./Footer/Footer";
import { useNavigate } from "react-router-dom";
import "./PricingPage.css";

export default function PricingPage() {
    const navigate = useNavigate();

    return (
        <>
            {/* HEADER */}
            <HomeHeader />

            <section className="pricing-page">
                <div className="container">

                    {/* PAGE TITLE */}
                    <div className="pricing-header">
                        <h1>
                            SellChats <span>Pricing</span>
                        </h1>
                        <p>Choose the plan that fits your business</p>
                    </div>

                    {/* MOST POPULAR CARD */}
                    <div className="pricing-wrapper">
                        <div className="pricing-card popular">

                            <div className="popular-badge">MOST POPULAR</div>

                            <h3 className="plan-name">Starter</h3>

                            <div className="price">
                                <span className="currency">FREE</span>

                            </div>

                            <p className="billing"> All Features Included</p>

                            <button
                                className="pricing-btn"
                                onClick={() => navigate("/login")}
                            >
                                Get Started
                            </button>

                            <ul className="features-pricing">
                                <li>✔ 50 Chatbots</li>
                                <li>✔ 2,500 Monthly Conversations</li>
                                <li>✔ Unlimited Websites</li>
                                <li>✔ Multi-language Support</li>
                                <li>✔ No Branding</li>
                                <li>✔ Priority Support</li>
                            </ul>

                        </div>
                    </div>

                </div>
            </section>

            {/* FOOTER */}
            <Footer />
        </>
    );
}
