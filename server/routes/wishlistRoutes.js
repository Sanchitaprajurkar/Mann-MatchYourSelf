const express = require("express");
const {
  toggleWishlist,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  clearWishlist,
} = require("../controllers/wishlistController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All wishlist routes require authentication
router.use(protect);

// POST /api/wishlist - Toggle wishlist (add/remove)
router.post("/", toggleWishlist);

// POST /api/wishlist/add - Add to wishlist
router.post("/add", addToWishlist);

// DELETE /api/wishlist/:productId - Remove from wishlist
router.delete("/:productId", removeFromWishlist);

// GET /api/wishlist - Get user's wishlist
router.get("/", getWishlist);

// DELETE /api/wishlist - Clear entire wishlist
router.delete("/", clearWishlist);

module.exports = router;
