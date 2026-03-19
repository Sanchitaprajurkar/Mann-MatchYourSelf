const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getDashboardStats,
} = require("../controllers/productController");
const upload = require("../middleware/upload");

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);

// Admin routes (temporarily public for testing)
router.get("/dashboard/stats", getDashboardStats);
router.post("/", upload.array("images", 5), createProduct);
router.put("/:id", upload.array("images", 5), updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
