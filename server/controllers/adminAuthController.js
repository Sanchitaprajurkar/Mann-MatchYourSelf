const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

exports.loginAdmin = async (req, res) => {
  try {
    console.log("🔑 ========================================");
    console.log("🔑 ADMIN LOGIN ATTEMPT");
    console.log("🔑 Request body:", req.body);
    
    const { email, password } = req.body;
    console.log("🔑 Email:", email);
    console.log("🔑 Password provided:", !!password);

    // Validate input
    if (!email || !password) {
      console.log("🔑 ERROR: Missing email or password");
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find admin and explicitly select password field
    console.log("🔑 Searching for admin with email:", email);
    const admin = await Admin.findOne({ email }).select("+password");
    
    if (!admin) {
      console.log("🔑 ERROR: Admin not found with email:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    console.log("🔑 Admin found:", admin.email);
    console.log("🔑 Admin name:", admin.name);
    console.log("🔑 Admin has password:", !!admin.password);

    // Compare passwords
    console.log("🔑 Comparing passwords...");
    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("🔑 Password match result:", isMatch);
    
    if (!isMatch) {
      console.log("🔑 ERROR: Password mismatch");
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    console.log("🔑 Password verified successfully");

    // Create JWT token
    const tokenPayload = { id: admin._id, role: "admin" };
    console.log("🔑 Creating JWT with payload:", tokenPayload);
    console.log("🔑 Using JWT_SECRET:", process.env.JWT_SECRET ? "SET" : "NOT SET");
    
    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("🔑 JWT created successfully");
    console.log("🔑 Token preview:", token.substring(0, 30) + "...");

    const responseData = {
      success: true,
      token,
      data: {
        id: admin._id,
        email: admin.email,
        role: "admin",
      },
    };

    console.log("🔑 ✅ ADMIN LOGIN SUCCESSFUL:", admin.email);
    console.log("🔑 Sending response");
    console.log("🔑 ========================================");

    res.status(200).json(responseData);
  } catch (error) {
    console.error("🔑 ❌ ADMIN LOGIN ERROR:", error.message);
    console.error("🔑 Error stack:", error.stack);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};
