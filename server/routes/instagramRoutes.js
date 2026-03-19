import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/reels", async (req, res) => {
  try {
    const INSTAGRAM_USER_ID = process.env.IG_USER_ID;
    const ACCESS_TOKEN = process.env.IG_ACCESS_TOKEN;

    const url = `https://graph.instagram.com/${INSTAGRAM_USER_ID}/media?fields=id,media_type,media_url,thumbnail_url,permalink&access_token=${ACCESS_TOKEN}`;

    const response = await fetch(url);
    const data = await response.json();

    const reels = data.data.filter(
      (item) => item.media_type === "VIDEO"
    );

    res.json(reels);
  } catch (error) {
    res.status(500).json({ error: "Instagram fetch failed" });
  }
});

export default router;
