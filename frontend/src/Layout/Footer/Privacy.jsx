import HomeHeader from "../HomeHeader";
import Footer from "../Footer/Footer";
import "./LegalPages.css";

export default function Privacy() {
  return (
    <>
      <HomeHeader />

      <section className="container legal-page">
        <div className="legal-container">
          <h1>Privacy Policy</h1>
          <p><strong>Last Updated:</strong> January 12, 2026</p>

          <p>
            This Privacy Policy explains how SellChats (“we”, “us”, “our”) collects,
            uses, stores, and protects your personal information when you access
            or use our websites, APIs, AI chatbot services, and related platforms
            (collectively, the “Services”).
          </p>

          <p>
            This policy should be read together with our Terms of Use and AI Policy.
            By using SellChats, you consent to the data practices described below.
          </p>

          <h2>1. Who This Policy Applies To</h2>
          <p>
            This policy applies to visitors of our websites, customers who use
            SellChats services, API users, AI functionality users, and individuals
            who interact with chatbots created using our platform.
          </p>

          <h2>2. Information We Collect</h2>

          <h3>From Customers</h3>
          <ul>
            <li>Account information such as name, email address, and login credentials</li>
            <li>Billing and payment details for paid subscriptions</li>
            <li>Account preferences including language, timezone, and notifications</li>
            <li>Form data, chatbot data, and knowledge base content you upload</li>
          </ul>

          <h3>From Website Visitors</h3>
          <ul>
            <li>Usage data such as pages visited, clicks, and interaction patterns</li>
            <li>Device and browser information, IP address, and inferred location</li>
            <li>Referral and analytics data collected via cookies and tracking tools</li>
          </ul>

          <h3>From End Users & AI Interactions</h3>
          <p>
            When users interact with AI chatbots built using SellChats, we may
            process conversation inputs and responses to deliver services and
            improve AI performance. We do not sell this data.
          </p>

          <h2>3. How We Use Your Information</h2>
          <ul>
            <li>To provide, operate, and maintain our services and APIs</li>
            <li>To improve AI models, platform performance, and security</li>
            <li>To process payments and manage subscriptions</li>
            <li>To communicate service updates and account notifications</li>
            <li>To prevent fraud, abuse, and unauthorized activity</li>
            <li>To comply with legal obligations</li>
          </ul>

          <h2>4. AI & Automated Processing</h2>
          <p>
            SellChats uses artificial intelligence to generate chatbot responses
            and automate workflows. AI outputs may not always be accurate and
            should not be relied upon for legal, medical, or financial decisions.
          </p>

          <h2>5. Data Sharing & Disclosure</h2>
          <p>
            We do not sell or rent your personal information. We may share data:
          </p>
          <ul>
            <li>With trusted service providers (hosting, analytics, payments)</li>
            <li>To comply with legal or regulatory requests</li>
            <li>During business transfers such as mergers or acquisitions</li>
            <li>With your consent or at your direction</li>
          </ul>

          <h2>6. Data Retention</h2>
          <p>
            We retain personal information only as long as necessary to provide
            services, comply with legal obligations, and enforce our agreements.
            Data is securely deleted when no longer required.
          </p>

          <h2>7. Your Rights</h2>
          <p>
            Depending on your location, you may have rights to:
          </p>
          <ul>
            <li>Access and review your personal data</li>
            <li>Request correction or deletion of data</li>
            <li>Withdraw consent for certain processing</li>
            <li>Request data portability</li>
          </ul>

          <p>
            Requests can be made by contacting us at
            <strong> privacy@sellchats.ai</strong>.
          </p>

          <h2>8. Security</h2>
          <p>
            We implement industry-standard technical and organizational measures
            to protect your information against unauthorized access, loss, or
            misuse.
          </p>

          <h2>9. Children’s Privacy</h2>
          <p>
            SellChats is not intended for use by individuals under the age of 13.
            We do not knowingly collect personal data from children.
          </p>

          <h2>10. International Data Transfers</h2>
          <p>
            Your data may be processed in countries other than your own. We ensure
            appropriate safeguards are in place for international data transfers
            in compliance with applicable laws.
          </p>

          <h2>11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy periodically. Continued use of the
            Services after changes indicates acceptance of the updated policy.
          </p>

          <h2>12. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our data
            practices, contact us at:
          </p>
          <p>
            <strong>Email:</strong> privacy@sellchats.ai
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
