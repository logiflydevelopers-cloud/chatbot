import { useState } from "react";
import arrowDownIcon from "../image/arrow-down-sign-to-navigate.png";
import "./FAQPage.css";
import Footer from "./Footer/Footer";
import HomeHeader from "./HomeHeader";

const leftFaqs = [
  { id: "l1", q: "Can I test ChatBot for free?", a: "Yes, you can try ChatBot for free with limited features." },
  { id: "l2", q: "Are technical skills required?", a: "No, anyone can set it up easily." },
  { id: "l3", q: "Can ChatBot be integrated with LiveChat?", a: "Yes, ChatBot integrates smoothly with LiveChat tools." },
  { id: "l4", q: "What is a chatbot?", a: "A chatbot is software that chats with users automatically." }
];

const rightFaqs = [
  { id: "r1", q: "Does installing ChatBot require coding?", a: "No coding is required. Just copy-paste the script." },
  { id: "r2", q: "What is a generative AI chatbot?", a: "It uses AI models to generate smart replies." },
  { id: "r3", q: "Can one chatbot work on multiple channels?", a: "Yes, one bot can serve website, WhatsApp and more." },
  { id: "r4", q: "How does a generative AI chatbot work?", a: "It learns from data and responds intelligently." }
];

function FAQItem({ item, isOpen, onClick }) {
  return (
    <div className={`faq-item ${isOpen ? "open" : ""}`}>
      <button className="faq-question" onClick={onClick}>
        {item.q}
        <span className="faq-arrow">
          <img src={arrowDownIcon} alt="arrow" />
        </span>
      </button>

      <div className="faq-answer-wrapper" style={{ maxHeight: isOpen ? "200px" : "0" }}>
        <div className="faq-answer">{item.a}</div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [activeId, setActiveId] = useState(null);

  return (
    <>
      {/* ✅ SHOW HEADER */}
      <HomeHeader />

      <section className="faq-section">
        <div className="container">
          <h1 className="faq-title">Frequently Asked Questions</h1>

          <div className="faq-grid">
            {/* LEFT */}
            <div className="faq-col">
              {leftFaqs.map(item => (
                <FAQItem
                  key={item.id}
                  item={item}
                  isOpen={activeId === item.id}
                  onClick={() =>
                    setActiveId(activeId === item.id ? null : item.id)
                  }
                />
              ))}
            </div>

            {/* RIGHT */}
            <div className="faq-col">
              {rightFaqs.map(item => (
                <FAQItem
                  key={item.id}
                  item={item}
                  isOpen={activeId === item.id}
                  onClick={() =>
                    setActiveId(activeId === item.id ? null : item.id)
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </>
  );
}
