const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  deleteAccount,
} = require("../controllers/userAuthController");
const { protect } = require("../middleware/authMiddleware");

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
router.post("/signup", signup);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post("/login", login);

// @desc    Request password reset email
// @route   POST /api/auth/forgot-password
// @access  Public
router.post("/forgot-password", forgotPassword);

// @desc    Reset password using token
// @route   POST /api/auth/reset-password/:token
// @access  Public
router.post("/reset-password/:token", resetPassword);

// @desc    Delete current user account
// @route   DELETE /api/auth/account
// @access  Private
router.delete("/account", protect, deleteAccount);

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get("/me", protect, getMe);

module.exports = router;
