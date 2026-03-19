// Admin-only middleware - use AFTER authenticateToken
// Ensures only admin role can access the route
const adminOnly = (req, res, next) => {
  console.log("🛡️ ADMIN-ONLY CHECK");
  console.log("🎭 Current role:", req.role);

  if (req.role !== "admin") {
    console.log("❌ ACCESS DENIED - Not an admin");
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }

  console.log("✅ ADMIN ACCESS GRANTED");
  next();
};

module.exports = adminOnly;
