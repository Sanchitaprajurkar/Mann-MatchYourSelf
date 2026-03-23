const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const {
  getHeroSlides,
  getAllHeroSlides,
  addHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
} = require("../controllers/heroController");
const authenticateAdmin = require("../middleware/adminAuthMiddleware");

// ── Public routes ────────────────────────────────────────────────────────────
router.get("/", getHeroSlides);

// ── Admin-only routes ────────────────────────────────────────────────────────
router.get("/admin", authenticateAdmin, getAllHeroSlides);
router.post("/", authenticateAdmin, upload.single("image"), addHeroSlide);
router.put("/:id", authenticateAdmin, upload.single("image"), updateHeroSlide);
router.delete("/:id", authenticateAdmin, deleteHeroSlide);

module.exports = router;
