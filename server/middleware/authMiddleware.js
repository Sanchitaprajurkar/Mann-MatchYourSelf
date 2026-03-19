const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    console.log("🔐 AUTH MIDDLEWARE HIT");
    console.log("🔐 AUTH HEADER:", req.headers.authorization);

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      console.log("❌ NO TOKEN FOUND");
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    console.log("✅ TOKEN EXTRACTED:", token);

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret_key_here",
    );

    console.log("🔓 DECODED TOKEN:", decoded);

    // CRITICAL FIX: Ensure req.user.id is always available
    const userId = decoded.userId || decoded.id;
    const userRole = decoded.role;
    
    console.log("👤 EXTRACTED USER ID:", userId);
    console.log("🎭 EXTRACTED ROLE:", userRole);

    if (!userId) {
      console.log("❌ NO USER ID IN TOKEN");
      return res.status(401).json({
        success: false,
        message: "Invalid token structure",
      });
    }

    // Role-aware model selection
    let account = null;
    
    if (userRole === "admin") {
      console.log("🔍 FETCHING ADMIN FROM DB:", userId);
      account = await Admin.findById(userId).select("-password");
      console.log("👑 ADMIN FOUND:", account ? "YES" : "NO");
    } else {
      console.log("🔍 FETCHING USER FROM DB:", userId);
      account = await User.findById(userId).select("-password");
      console.log("👤 USER FOUND:", account ? "YES" : "NO");
    }

    if (!account) {
      console.log("❌ ACCOUNT NOT FOUND IN DB");
      return res.status(401).json({
        success: false,
        message: "Account not found",
      });
    }

    // Set both user object and ensure id is available
    req.user = account;
    req.user.id = userId; // CRITICAL: Ensure id is always available
    req.role = userRole; // Store role for downstream middleware

    console.log("✅ AUTH SUCCESS - Role:", userRole);

    next();
  } catch (error) {
    console.log("❌ AUTH ERROR:", error);
    console.log("❌ AUTH ERROR TYPE:", error.name);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Legacy alias for compatibility
const protect = authenticateToken;

module.exports = { protect, authenticateToken };
