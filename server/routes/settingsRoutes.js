const express = require("express");
const router = express.Router();
const uploadVideo = require("../middleware/videoUpload");
const {
  uploadHeroVideo,
  getHeroVideo,
  deleteHeroVideo,
} = require("../controllers/settingsController");
const { protect } = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminOnlyMiddleware");

// Public route - get hero video
router.get("/hero-video", getHeroVideo);

// Admin protected routes
router.post(
  "/hero-video",
  protect,
  adminOnly,
  uploadVideo.single("video"),
  uploadHeroVideo
);

router.delete("/hero-video", protect, adminOnly, deleteHeroVideo);

module.exports = router;
