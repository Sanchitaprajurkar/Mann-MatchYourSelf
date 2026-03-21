const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const upload = require("../middleware/upload"); // Used for multer upload

// Public/User routes
router.post("/submit", reviewController.submitReview); // Legacy
router.get("/product/:productId", reviewController.getProductReviews);

// Admin routes (Put these before dynamic :params)
router.get("/admin", protect, admin, reviewController.getAdminReviews);
router.put("/approve/:id", protect, admin, reviewController.approveReview);
router.put("/:reviewId", protect, admin, reviewController.updateReviewStatus);

// General
router.get("/", reviewController.getAllReviews); // for the Homepage
router.post("/", upload.single("image"), reviewController.createReview);

module.exports = router;
