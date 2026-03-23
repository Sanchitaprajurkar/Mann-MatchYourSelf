const express = require("express");
const router = express.Router();
const authenticateAdmin = require("../middleware/adminAuthMiddleware");

// ── Admin Auth routes (public — no middleware needed) ────────────────────────
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const Admin = require("../models/Admin");
    const bcrypt = require("bcryptjs");
    const jwt = require("jsonwebtoken");

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "30d" },
    );

    admin.password = undefined;

    res.json({
      success: true,
      token,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: "admin",
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/auth/me", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const jwt = require("jsonwebtoken");
    const Admin = require("../models/Admin");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({ success: false, message: "Admin not found" });
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
    res.status(401).json({ success: false, message: "Invalid token" });
  }
});

// ── Order management routes (Admin protected) ────────────────────────────────
const { getAllOrders, updateOrderStatus } = require("../controllers/orderController");

router.get("/orders", authenticateAdmin, getAllOrders);
router.patch("/orders/:id/status", authenticateAdmin, updateOrderStatus);

// ── Dashboard stats (Admin protected) ───────────────────────────────────────
const { getDashboardStats } = require("../controllers/adminController");

router.get("/stats", authenticateAdmin, getDashboardStats);

// ── Review management (Admin protected) ─────────────────────────────────────
const { hideReview, unhideReview } = require("../controllers/reviewController");

router.put("/reviews/:id/hide", authenticateAdmin, hideReview);
router.put("/reviews/:id/unhide", authenticateAdmin, unhideReview);

module.exports = router;
