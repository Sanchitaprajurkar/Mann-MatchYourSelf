const express = require("express");
const router = express.Router();

const adminOrderController = require("../controllers/adminOrderController");

const authenticateAdmin = require("../middleware/adminAuthMiddleware");

// Admin order routes - use admin authentication
router.get("/", authenticateAdmin, adminOrderController.getAllOrders);
router.patch(
  "/:id/status",
  authenticateAdmin,
  adminOrderController.updateOrderStatus,
);

module.exports = router;
