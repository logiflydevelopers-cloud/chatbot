import HomeHeader from "../HomeHeader";
import Footer from "../Footer/Footer";
import "./LegalPages.css";

export default function Terms() {
  return (
    <>
      <HomeHeader />

      <section className="container legal-page">
        <div className="legal-container">
          <h1>Terms of Use</h1>
          <p><strong>Last Updated:</strong> January 12, 2026</p>

          <p>
            These Terms of Use (“Terms”) govern your access to and use of the
            SellChats websites, APIs, dashboards, and AI-powered chatbot platform
            (collectively, the “Services”). By accessing or using SellChats, you
            agree to be bound by these Terms.
          </p>

          <h2>1. Definitions</h2>
          <p>
            “You” or “User” refers to any individual or entity using the Services.
            “SellChats”, “we”, “us”, or “our” refers to SellChats and its affiliated
            entities.
          </p>

          <h2>2. Use of the Platform</h2>
          <p>
            You may use the SellChats platform and APIs only in compliance with
            these Terms and all applicable laws. You are responsible for all
            activity that occurs under your account and API credentials.
          </p>

          <h2>3. Artificial Intelligence Disclaimer</h2>
          <p>
            SellChats uses artificial intelligence to generate responses, automate
            workflows, and assist with customer interactions. AI-generated outputs
            are provided “as is” and may be inaccurate. Do not rely on AI responses
            for legal, medical, financial, or safety-critical decisions.
          </p>

          <h2>4. Information We Collect</h2>
          <p>
            We collect account data, usage data, input data, device information,
            and billing details as described in our Privacy Policy. By using
            SellChats, you consent to such data collection and processing.
          </p>

          <h2>5. Prohibited Uses</h2>
          <ul>
            <li>Illegal, fraudulent, or deceptive activities</li>
            <li>Spam, phishing, or unsolicited messaging</li>
            <li>Collection of highly sensitive personal data without authorization</li>
            <li>Harassment, abuse, or harmful content</li>
            <li>Reverse engineering or misuse of APIs</li>
          </ul>

          <h2>6. Data Responsibility</h2>
          <p>
            You retain ownership of the data you provide or collect using SellChats.
            You are solely responsible for ensuring that your data usage complies
            with applicable privacy and data protection laws.
          </p>

          <h2>7. Payments & Subscriptions</h2>
          <p>
            Paid plans are billed on a recurring basis unless canceled. Failure to
            process payment may result in suspension or termination of access.
          </p>

          <h2>8. Termination</h2>
          <p>
            SellChats reserves the right to suspend or terminate your access to
            the Services if you violate these Terms or misuse the platform.
          </p>

          <h2>9. Disclaimer of Warranties</h2>
          <p>
            The Services are provided on an “AS IS” and “AS AVAILABLE” basis.
            SellChats disclaims all warranties, including implied warranties of
            merchantability and fitness for a particular purpose.
          </p>

          <h2>10. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, SellChats shall not be liable
            for indirect, incidental, special, or consequential damages arising
            from your use of the Services.
          </p>

          <h2>11. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the
            laws applicable in the jurisdiction where SellChats operates.
          </p>

          <h2>12. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use of the
            Services after changes constitutes acceptance of the updated Terms.
          </p>

          <h2>13. Contact Us</h2>
          <p>
            If you have any questions regarding these Terms, please contact us at
            <strong> support@sellchats.ai</strong>.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
