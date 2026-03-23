const express = require("express");
const router = express.Router();
const {
  createRazorpayOrder,
  verifyPayment,
  getRazorpayKey,
  razorpayWebhook,
} = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

// Get Razorpay key (public route for frontend)
router.get("/key", getRazorpayKey);

// Create Razorpay order (protected - requires authentication)
router.post("/create-order", protect, createRazorpayOrder);

// Verify payment (protected - requires authentication)
router.post("/verify-payment", protect, verifyPayment);

// Razorpay Webhook (public)
router.post("/webhook", razorpayWebhook);

module.exports = router;
