const express = require("express");
const router = express.Router();
const { loginAdmin } = require("../controllers/adminAuthController");
const { authenticateAdmin } = require("../middleware/adminAuthMiddleware");
const Admin = require("../models/Admin"); // Needed for /me route or move /me to controller too? User instruction only mentioned login. I will keep /me and logout as is for now or just minimal changes. 
// Actually, the user instruction only specified `router.post("/login", loginAdmin);`.
// But I should probably keep the other routes (`/me`, `/logout`) working.
// However, the user didn't provide controller code for `me` or `logout`. 
// I will keep existing `me` and `logout` logic inline for now to avoid breaking them, but update login.

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
router.post("/login", loginAdmin);

// @desc    Get current admin user
// @route   GET /api/auth/me
// @access  Private
router.get("/me", async (req, res) => {
  // ... existing logic ... 
  // Wait, I should probably check if I can/should move all logic.
  // For now, I'll copy the existing logic for /me and /logout to be safe, or just replace the login part.
  // The user said "Replace entire file" for middleware, but for routes, they said "Ensure: router.post("/login", loginAdmin);".
  // I will assume I should keep the other routes.
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // Verify token
    const jwt = require("jsonwebtoken"); // Re-requiring strictly for this block as top level might change
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key",
    );

    // Get admin
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.json({
      success: true,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: "admin",
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
});

// @desc    Logout admin
// @route   POST /api/auth/logout
// @access  Private
router.post("/logout", (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

module.exports = router;
