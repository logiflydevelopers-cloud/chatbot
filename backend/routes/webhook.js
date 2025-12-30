import express from "express";
import axios from "axios";
import xml2js from "xml2js";
import Page from "../models/Page.js";
import ChatbotSetting from "../models/ChatbotSetting.js";

const router = express.Router();

/* ======================================================
   ⭐ ADD WEBSITE (CRAWL + SAVE PAGES)
====================================================== */
router.post("/add-custom-website", async (req, res) => {
  try {
    let { userId, name, url, websiteURL } = req.body;

    url = url || websiteURL;
    if (!userId || !url) {
      return res.status(400).json({ error: "Missing userId or URL" });
    }

    name = name || new URL(url).hostname;

    const sitemapUrl = url.endsWith("/")
      ? `${url}sitemap.xml`
      : `${url}/sitemap.xml`;

    const response = await axios.get(sitemapUrl);
    const parsed = await xml2js.parseStringPromise(response.data);

    const urls =
      parsed?.urlset?.url?.map((u) => ({
        loc: u.loc?.[0],
        lastmod: u.lastmod?.[0] || null,
      })) || [];

    // 🔁 Replace old pages
    await Page.deleteMany({ userId, siteName: name });

    await Page.insertMany(
      urls.map((u) => ({
        userId,
        siteName: name,
        url: u.loc,
        lastModified: u.lastmod,
      }))
    );

    res.json({
      success: true,
      message: "Website added",
      total: urls.length,
    });
  } catch (err) {
    console.error("Add website error →", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* ======================================================
   ⭐ REMOVE WEBSITE
====================================================== */
router.delete("/remove-website", async (req, res) => {
  try {
    const { userId, name } = req.body;

    if (!userId || !name) {
      return res.status(400).json({ error: "Missing userId or siteName" });
    }

    await Page.deleteMany({ userId, siteName: name });

    // ⭐ ALSO CLEAR WEBSITE FROM chatbot settings
    await ChatbotSetting.updateOne(
      { userId },
      { $set: { website: null } }
    );

    res.json({ success: true, message: "Website removed" });
  } catch (err) {
    console.error("Remove website error →", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* ======================================================
   ⭐ GET WEBSITE PAGES (FOR TRAINING VERIFICATION)
   👉 THIS FIXES YOUR ERROR
====================================================== */
router.get("/website/:userId", async (req, res) => {
  try {
    const pages = await Page.find({ userId: req.params.userId });
    res.json(pages);
  } catch (err) {
    res.status(500).json([]);
  }
});

export default router;
