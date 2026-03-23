// Admin-only middleware — must be used AFTER authenticateToken or authenticateAdmin
const adminOnly = (req, res, next) => {
  if (req.role === "admin" || req.user?.role === "admin") {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Access denied. Admin privileges required.",
  });
};

module.exports = adminOnly;
