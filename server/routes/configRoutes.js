const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const {
  getSizes,
  addSize,
  getColors,
  addColor,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/configController.js");

const router = express.Router();

// Size routes
router.get("/sizes", getSizes);
router.post("/sizes", addSize);

// Color routes
router.get("/colors", getColors);
router.post("/colors", addColor);

// Category routes
router.get("/categories", getCategories);
router.post("/categories", upload.single("image"), addCategory);
router.put("/categories/:id", upload.single("image"), updateCategory);
router.delete("/categories/:id", deleteCategory);

module.exports = router;
