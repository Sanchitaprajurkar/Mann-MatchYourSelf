const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Product = require("../models/Product");

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  console.log("🔥 SIGNUP HIT");
  console.log("📦 BODY:", req.body);

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.log("❌ Missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ USER ALREADY EXISTS:", email);
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    // Hash password manually since middleware is disabled
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();

    console.log("✅ USER CREATED:", user._id);

    // Create token
    const token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: process.env.JWT_EXPIRE || "30d" },
    );

    // Send success response
    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("🔥 SIGNUP ERROR FULL:", error);
    console.error("🔥 ERROR MESSAGE:", error.message);
    console.error("🔥 ERROR STACK:", error.stack);

    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: process.env.JWT_EXPIRE || "30d" },
    );

    // Remove password from output
    user.password = undefined;

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        cart: user.cart,
        wishlist: user.wishlist,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMe = async (req, res) => {
  try {
    // Re-fetch user with populated products since req.user from middleware is unpopulated
    const user = await User.findById(req.user._id)
      .populate("cart.product", "name price images")
      .populate("wishlist.product", "name price images");
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        cart: user.cart,
        wishlist: user.wishlist,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  signup,
  login,
  getMe,
};
