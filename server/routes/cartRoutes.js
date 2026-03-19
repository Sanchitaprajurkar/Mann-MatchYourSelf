const express = require("express");
const {
  addToCartNew,
  updateCartItem,
  removeFromCart,
  getCart,
  clearCart,
  syncCart,
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All cart routes require authentication
router.use(protect);

// POST /api/cart - Add item to cart
router.post("/", addToCartNew);

// POST /api/cart/sync - Sync localStorage cart to backend
router.post("/sync", syncCart);

// PUT /api/cart/:productId - Update cart item quantity
router.put("/:productId", updateCartItem);

// DELETE /api/cart/:productId - Remove item from cart
router.delete("/:productId", removeFromCart);

// GET /api/cart - Get user's cart
router.get("/", getCart);

// DELETE /api/cart - Clear entire cart
router.delete("/", clearCart);

module.exports = router;
