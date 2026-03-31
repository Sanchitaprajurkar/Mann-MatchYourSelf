const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");
const Product = require("../models/Product");
const Address = require("../models/Address");
const Order = require("../models/Order");
const Review = require("../models/Review.model");
const { createTransporter } = require("../utils/sendEmail");
const { destroyCloudinaryAsset } = require("../utils/cloudinary");

const buildResetPasswordUrl = (token) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  return `${frontendUrl.replace(/\/$/, "")}/reset-password/${token}`;
};

const forgotPassword = async (req, res) => {
  try {
    const email = req.body?.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide your email address",
      });
    }

    console.log("Forgot password API hit");
    console.log("Email:", email);

    const user = await User.findOne({ email }).select("+resetToken +resetTokenExpiry");
    console.log("User:", user ? user._id : null);

    if (!user) {
      return res.json({
        success: true,
        message:
          "If an account exists for this email, a reset link has been sent.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    console.log("Generated Token:", token);

    user.resetToken = crypto.createHash("sha256").update(token).digest("hex");
    user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    await user.save();
    console.log("Saved Token in DB");

    const resetUrl = buildResetPasswordUrl(token);
    console.log("Reset URL:", resetUrl);

    try {
      const transporter = createTransporter();

      await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: email,
        subject: "Reset your MANN Match Yourself password",
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1a1a1a;max-width:560px;margin:0 auto;padding:24px;">
            <h2 style="margin-bottom:16px;">Reset your password</h2>
            <p>Hello ${user.name || "there"},</p>
            <p>We received a request to reset your password. Use the button below to choose a new one.</p>
            <p style="margin:24px 0;">
              <a href="${resetUrl}" style="display:inline-block;background:#1a1a1a;color:#ffffff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;">
                Reset Password
              </a>
            </p>
            <p>This link will expire in 1 hour.</p>
            <p>If you did not request this, you can safely ignore this email.</p>
            <p style="word-break:break-all;color:#6b7280;">${resetUrl}</p>
          </div>
        `,
      });

      console.log("Email sent ✅");
    } catch (err) {
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();
      console.log("Email error ❌", err);

      return res.status(500).json({
        success: false,
        message: "We could not send the reset email right now. Please try again.",
      });
    }

    return res.json({
      success: true,
      message: "If an account exists for this email, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const password = req.body?.password;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and password are required",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: new Date() },
    }).select("+password +resetToken +resetTokenExpiry");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "This reset link is invalid or has expired.",
      });
    }

    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(password, salt);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    return res.json({
      success: true,
      message: "Your password has been reset successfully.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "You must be logged in to delete your account.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const reviews = await Review.find({ userId }).select("images");
    const reviewImagePublicIds = reviews.flatMap((review) =>
      (review.images || [])
        .map((image) => image.publicId)
        .filter(Boolean),
    );

    await Promise.allSettled(
      reviewImagePublicIds.map((publicId) => destroyCloudinaryAsset(publicId)),
    );

    const [deletedAddresses, deletedOrders, deletedReviews] = await Promise.all([
      Address.deleteMany({ user: userId }),
      Order.deleteMany({ user: userId }),
      Review.deleteMany({ userId }),
    ]);

    await User.findByIdAndDelete(userId);

    return res.json({
      success: true,
      message: "Your account has been deleted successfully.",
      deleted: {
        addresses: deletedAddresses.deletedCount || 0,
        orders: deletedOrders.deletedCount || 0,
        reviews: deletedReviews.deletedCount || 0,
      },
    });
  } catch (error) {
    console.error("Delete account error:", error);
    return res.status(500).json({
      success: false,
      message: "We could not delete your account right now. Please try again.",
    });
  }
};

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
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        mobileNumber: user.mobileNumber,
        createdAt: user.createdAt,
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
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        mobileNumber: user.mobileNumber,
        createdAt: user.createdAt,
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
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        mobileNumber: user.mobileNumber,
        createdAt: user.createdAt,
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
  forgotPassword,
  resetPassword,
  deleteAccount,
};
