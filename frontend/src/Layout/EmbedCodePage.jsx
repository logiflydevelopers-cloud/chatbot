import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EmbedCodePage.css";

// platform images
import wordpress from "../image/wordpress.svg";
import shopify from "../image/shopify.svg";
import wix from "../image/wix.svg";
import GoDaddy from "../image/GoDaddy.svg";
import framer from "../image/framer.svg";
import blogger from "../image/blogger.svg";
import Google from "../image/Google Sites.svg";
import joomla from "../image/joomla.svg";

const PLATFORMS = [
  {
    id: "WordPress",
    img: wordpress,
    steps: [
      "Click on the <strong> Neon Blue Copy Code button </strong> above to copy the embed code",
      "Then go to your <strong> WordPress post </strong> or <strong> Page Editor </strong> and add a <strong> New Block </strong>",
      "Click on the <strong>Custom HTML button</strong>",
      "Paste the code you copied into the <strong> HTML text </strong>",
      "Now, click on<strong> Update</strong> to save your post",
      "That's it!",
    ],
  },
  {
    id: "Shopify",
    img: shopify,
    steps: [
      "Click on the <strong>Neon Blue Copy Code button</strong> above to copy the embed code",
      "From Shopify’s left-hand menu, navigate to the <strong> Online Store </strong> in the<strong> Sales Channels</strong> section.",
      "In the <strong>Themes</strong> section, locate your current theme.",
      "Click the ellipsis (•••) icon beside your theme, then choose Edit <strong>Code</strong> to open the theme files.",
      "Click <strong>theme.liquid</strong> to open it for editing.",
      "Paste the copied code snippet anywhere within the <strong><head></strong> and<strong> </head></strong> tags.",
      "After inserting the embed code, click <strong>Save </strong>in the editor’s top-right corner.",
      "That's it!",
    ],
  },
  {
    id: "Wix",
    img: wix,
    steps: [
      "Click on the<strong> Neon Blue Copy Code button</strong> above to copy the embed code",
      "Go to the Wix Editor and click<strong> Search</strong> on the right",
      "Select <strong>Embeds</strong> and click <strong>Embed HTML</strong>",
      "Paste the copied code into the HTML",
      "Click <strong>Update</strong>",
      "Click <strong>Publish</strong> in the upper right corner",
      "That's it!",
    ],
  },
  {
    id: "GoDaddy",
    img: GoDaddy,
    steps: [
      "Copy the the embed code above",
      "In the GoDaddy Website Builder, go to <strong>Website</strong> in the upper right corner",
      "Add a new section to your desired page",
      "Search for <strong>HTML</strong> and click <strong>Add</strong>",
      "Paste your embed code under <strong>Custom Code</strong>, then click <strong>Done</strong>",
      "That's it!",
    ],
  },
  {
    id: "Framer",
    img: framer,
    steps: [
      "Click on the <strong>Neon Blue Copy Code button</strong> above to copy the embed code",
      "In Framer, go to the <strong>Insert</strong> menu and select Utility under <strong>Elements</strong>",
      "Drag and drop the <strong> Embed </strong>element onto your page, and select <strong>HTML</strong> as embed type",
      "Paste your embed code into the <strong>Embed</strong> section on the right",
      "Click <strong>Publish</strong>",
      "That's it!",
    ],
  },
  {
    id: "Blogger",
    img: blogger,
    steps: [
      "Click on the <strong>Neon Blue Copy Code button </strong>above to copy the embed code",
      "In your Blogger dashboard, go to <strong>Pages</strong> on the left",
      "Create or edit a page",
      "Click the pencil icon, then click <strong>HTML view</strong>",
      "Paste the embed code, then click <strong>Update</strong>",
      "That's it!",
    ],
  },
  {
    id: "Google",
    img: Google,
    steps: [
      "On Google Sites, go to the <strong>Insert</strong> tab, then click <strong>Embed</strong>",
      "Click the <strong>Embed Code</strong> tab",
      "Copy the code above and paste it into Google Sites, then click <strong>Next</strong>",
      "Click <strong>Insert</strong>",
      "Click <strong>Publish</strong>",
      "That's it!",
    ],
  },
  {
    id: "Joomla",
    img: joomla,
    steps: [
      "In your Joomla dashboard, go to <strong> System</strong>, then select <strong>Plugins</strong>",
      "On the next page, search and select <strong>TinyMCE</strong>",
      "Select <strong>Set</strong> 0 (for Super Users)",
      "Scroll down and turn on the<strong> Use Joomla Text </strong>filter",
      "And turn off the <strong>Sandbox Iframes</strong> toggle",
      "Return to the main dashboard, then go to <strong>System</strong> and select <strong>Text Filters</strong>",
      "Make sure that <strong>Super Users</strong> is set to No Filtering",
      "Paste the embed code to source code editor",
    ],
  },
];

const EmbedCodePage = ({ user }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [activePlatform, setActivePlatform] = useState("WordPress");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const embedCode = `<script src="http://localhost:4000/embed/${userId}.js" async></script>`;

  const copyCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedPlatform = PLATFORMS.find(
    (p) => p.id === activePlatform
  );

  return (
    <div>
      <div className="embed-header">Get Your Embed Code</div>
      <div className="embed-page">
        {/* HEADER */}


        <p className="embed-subtitle">
          Paste this script into your website, Shopify, or WordPress to display your chatbot.
        </p>

        {/* CODE */}
        <div className="code-box">{embedCode}</div>

        <button className="copy-btn" onClick={copyCode}>
          &lt;/&gt; Copy Code
        </button>

        {copied && <div className="copy-toast">✅ Code copied successfully</div>}

        {/* PLATFORMS */}
        <h3 className="platform-title">Select Platforms</h3>

        <div className="platform-slider">
          {PLATFORMS.map((p) => (
            <div
              key={p.id}
              className={`platform-card ${activePlatform === p.id ? "active" : ""
                }`}
              onClick={() =>
                setActivePlatform(activePlatform === p.id ? null : p.id)
              }
            >
              <img src={p.img} alt={p.id} className="platform-img" />
              <span>{p.id}</span>
            </div>
          ))}
        </div>

        {/* PLATFORM CONTENT */}
        {selectedPlatform && (
          <div className="platform-content animate">
            <h4>How to embed on {selectedPlatform.id}</h4>

            <ul className="steps-list">
              {selectedPlatform.steps.map((step, index) => (
                <li key={index}>
                  <span className="step-number">{index + 1}</span>
                  <span
                    className="step-text"
                    dangerouslySetInnerHTML={{ __html: step }}
                  ></span>

                </li>
              ))}
            </ul>
          </div>

        )}
      </div>
    </div>

  );
};

export default EmbedCodePage;
