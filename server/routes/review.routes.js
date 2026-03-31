const express = require("express");
const reviewController = require("../controllers/review.controller");
const {
  protect,
  optionalAuthenticateToken,
} = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminOnlyMiddleware");
const { reviewImageUpload } = require("../middleware/upload.middleware");

const router = express.Router();

router.get("/admin", protect, adminOnly, reviewController.getAdminReviews);
router.get("/product/:productId/eligibility", protect, reviewController.getReviewEligibility);
router.get("/product/:productId", optionalAuthenticateToken, reviewController.getProductReviews);
router.get("/", optionalAuthenticateToken, reviewController.getAllReviews);

router.post("/submit", reviewController.submitReview);
router.post(
  "/upload-images",
  protect,
  reviewImageUpload.array("images", 5),
  reviewController.uploadReviewImages,
);
router.post(
  "/",
  protect,
  reviewController.createReview,
);
router.post("/:reviewId/vote", protect, reviewController.voteReview);
router.post("/:reviewId/report", protect, reviewController.reportReview);
router.delete("/:reviewId", protect, reviewController.deleteReview);

router.patch("/:reviewId/moderate", protect, adminOnly, reviewController.updateReviewStatus);
router.put(
  "/approve/:id",
  protect,
  adminOnly,
  (req, res, next) => {
    req.params.reviewId = req.params.id;
    next();
  },
  reviewController.approveReview,
);
router.put("/:reviewId", protect, adminOnly, reviewController.updateReviewStatus);

module.exports = router;
