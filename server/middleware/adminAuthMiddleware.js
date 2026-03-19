const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const authenticateAdmin = async (req, res, next) => {
  try {
    console.log("🔐 ADMIN AUTH MIDDLEWARE HIT");
    console.log("ADMIN AUTH HEADER:", req.headers.authorization);

    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("🔐 ERROR: Missing or invalid authorization header");
      return res.status(401).json({ message: "Missing admin token" });
    }

    const token = authHeader.split(" ")[1];
    console.log("🔐 Token extracted:", token ? token.substring(0, 30) + "..." : "null");

    if (!token || token === "null" || token === "undefined") {
      console.log("🔐 ERROR: Token is null or undefined");
      return res.status(401).json({ message: "Invalid admin token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔐 Token decoded:", { id: decoded.id, role: decoded.role });

    // Check admin role
    if (!decoded || decoded.role !== "admin") {
      console.log("🔐 ERROR: Not an admin role");
      return res.status(401).json({ message: "Admin access required" });
    }

    // Find admin
    const admin = await Admin.findById(decoded.id).select("-password");
    
    if (!admin) {
      console.log("🔐 ERROR: Admin not found in database");
      return res.status(401).json({ message: "Admin not found" });
    }

    console.log("🔐 ADMIN FOUND:", admin.email);

    // Attach admin to request
    req.admin = admin;
    req.user = {
      id: admin._id.toString(),
      _id: admin._id,
      email: admin.email,
      role: "admin",
    };

    console.log("🔐 ✅ ADMIN AUTHENTICATED:", admin.email);
    next();
  } catch (error) {
    console.error("🔐 ❌ ADMIN AUTH ERROR:", error.message);
    return res.status(401).json({ message: "Admin authentication failed" });
  }
};

module.exports = authenticateAdmin;
