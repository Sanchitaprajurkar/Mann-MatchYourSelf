const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");

// Unified authentication middleware — works for both users and admins
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "Access token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.userId || decoded.id;
    const userRole = decoded.role;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Invalid token structure" });
    }

    let account = null;

    if (userRole === "admin") {
      account = await Admin.findById(userId).select("-password");
    } else {
      account = await User.findById(userId).select("-password");
    }

    if (!account) {
      return res.status(401).json({ success: false, message: "Account not found" });
    }

    req.user = account;
    req.user.id = userId;
    req.role = userRole;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired. Please log in again." });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const optionalAuthenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      next();
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id;
    const userRole = decoded.role;

    if (!userId) {
      next();
      return;
    }

    let account = null;
    if (userRole === "admin") {
      account = await Admin.findById(userId).select("-password");
    } else {
      account = await User.findById(userId).select("-password");
    }

    if (account) {
      req.user = account;
      req.user.id = userId;
      req.role = userRole;
    }

    next();
  } catch (error) {
    next();
  }
};

// Legacy alias
const protect = authenticateToken;

module.exports = { protect, authenticateToken, optionalAuthenticateToken };
