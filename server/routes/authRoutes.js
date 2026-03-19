const express = require("express");
const {
  registerUser,
  loginUser,
  verifyToken,
  updateProfile,
  getProfile,
} = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");
const router = express.Router();

// Register routes (only /register for compatibility)
router.post("/register", registerUser);
// Removed /signup route to avoid conflicts with userAuthRoutes

// Login route
router.post("/login", loginUser);

// Verify token route
router.get("/verify", authenticateToken, verifyToken);

// Get current user route (for admin)
router.get("/me", authenticateToken, verifyToken);

// Profile routes (protected)
router.get("/profile", authenticateToken, getProfile);
router.put("/profile", authenticateToken, updateProfile);

module.exports = router;
