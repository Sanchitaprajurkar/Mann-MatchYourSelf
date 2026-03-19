const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register User
const registerUser = async (req, res) => {
  try {
    console.log("=== REGISTRATION ATTEMPT ===");
    console.log("Request body:", req.body);
    
    let { name, email, password } = req.body;
    email = email.trim().toLowerCase();

    console.log("Processed data:", { name, email, password: "***" });

    // Validate required fields
    if (!name || !email || !password) {
      console.log("Validation failed: Missing required fields");
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    // Validate password length
    if (password.length < 6) {
      console.log("Validation failed: Password too short");
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    console.log("Checking if user exists...");
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists:", email);
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    console.log("Creating new user...");
    // Create new user (password will be hashed by pre-save middleware)
    const newUser = new User({
      name: name.trim(),
      email,
      password,
      role: "user", // Default role
    });

    console.log("Saving user to database...");
    await newUser.save();
    console.log("User saved successfully:", newUser._id);

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    console.log("Token generated, sending response");
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("=== REGISTRATION ERROR ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Full error:", error);
    
    // Handle specific MongoDB errors
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors)
        .map((val) => val.message)
        .join(", ");
      return res.status(400).json({
        success: false,
        message: `Validation Error: ${message}`,
      });
    }

    if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email?.trim().toLowerCase();

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.status(200).json({
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
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// Update User Profile
const updateProfile = async (req, res) => {
  try {
    const { name, gender, dateOfBirth, mobileNumber } = req.body;
    const userId = req.user.userId;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update allowed fields
    if (name) user.name = name;
    if (gender) user.gender = gender;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (mobileNumber) user.mobileNumber = mobileNumber;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        mobileNumber: user.mobileNumber,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during profile update",
    });
  }
};

// Get User Profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        mobileNumber: user.mobileNumber,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
    });
  }
};

// Verify Token
const verifyToken = async (req, res) => {
  try {
    // User should be attached by authenticateToken middleware
    if (!req.user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json({ message: "Server error during token verification" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateProfile,
  getProfile,
  verifyToken,
};
