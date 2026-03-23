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
const authenticateAdmin = require("../middleware/adminAuthMiddleware");

// ── Public routes ────────────────────────────────────────────────────────────
router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);

// ── Admin-only routes (require admin token) ──────────────────────────────────
router.get("/dashboard/stats", authenticateAdmin, getDashboardStats);
router.post("/", authenticateAdmin, upload.array("images", 5), createProduct);
router.put("/:id", authenticateAdmin, upload.array("images", 5), updateProduct);
router.delete("/:id", authenticateAdmin, deleteProduct);

module.exports = router;
