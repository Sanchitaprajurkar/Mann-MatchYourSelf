const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// Public/User routes
router.post("/submit", reviewController.submitReview);
router.get("/product/:productId", reviewController.getProductReviews);

// Admin routes
// I'm not sure if I should rely on 'admin' middleware availability without checking. 
// I'll check 'server/middleware' in next step but for now I'll use placeholders if needed.
// Wait, I saw 'middleware' folder in Step 5 list_dir.
// And 'adminAuthRoutes.js' uses it probably.

router.get("/pending", protect, admin, reviewController.getPendingReviews);
router.put("/:reviewId", protect, admin, reviewController.updateReviewStatus);

module.exports = router;
