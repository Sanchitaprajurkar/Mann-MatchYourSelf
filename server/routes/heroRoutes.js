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

// GET slides (public)
router.get("/", getHeroSlides);

// GET all slides (admin - includes inactive)
router.get("/admin", getAllHeroSlides);

// POST slide
router.post("/", upload.single("image"), addHeroSlide);

// PUT slide
router.put("/:id", upload.single("image"), updateHeroSlide);

// DELETE slide
router.delete("/:id", deleteHeroSlide);

module.exports = router;
