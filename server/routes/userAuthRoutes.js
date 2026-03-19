const express = require("express");
const router = express.Router();
const { signup, login, getMe } = require("../controllers/userAuthController");
const { protect } = require("../middleware/authMiddleware");

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
router.post("/signup", signup);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post("/login", login);

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get("/me", protect, getMe);

module.exports = router;
