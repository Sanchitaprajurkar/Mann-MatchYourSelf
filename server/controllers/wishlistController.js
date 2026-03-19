const User = require("../models/User");
const Product = require("../models/Product");

// Toggle wishlist (add/remove)
exports.toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const user = await User.findById(userId);

    // Check if product already exists in wishlist
    const existingIndex = user.wishlist.findIndex(
      (item) => item.product.toString() === productId,
    );

    let message;
    if (existingIndex > -1) {
      // Remove from wishlist
      user.wishlist.splice(existingIndex, 1);
      message = "Product removed from wishlist";
    } else {
      // Add to wishlist
      user.wishlist.push({
        product: productId,
        addedAt: new Date(),
      });
      message = "Product added to wishlist";
    }

    await user.save();

    // Populate product details for response
    const updatedUser = await User.findById(userId).populate({
      path: "wishlist.product",
      select: "name price images stock category slug",
      populate: {
        path: "category",
        select: "name slug",
      },
    });

    res.status(200).json({
      success: true,
      message,
      data: updatedUser.wishlist,
    });
  } catch (error) {
    console.error("Error toggling wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Error updating wishlist",
    });
  }
};

// Add to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const user = await User.findById(userId);

    // Check if product already exists in wishlist
    const exists = user.wishlist.some(
      (item) => item.product.toString() === productId,
    );

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist",
      });
    }

    // Add to wishlist
    user.wishlist.push({
      product: productId,
      addedAt: new Date(),
    });

    await user.save();

    const updatedUser = await User.findById(userId).populate({
      path: "wishlist.product",
      select: "name price images stock category slug",
      populate: {
        path: "category",
        select: "name slug",
      },
    });

    res.status(200).json({
      success: true,
      message: "Product added to wishlist successfully",
      data: updatedUser.wishlist,
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Error adding to wishlist",
    });
  }
};

// Remove from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    user.wishlist = user.wishlist.filter(
      (item) => item.product.toString() !== productId,
    );

    await user.save();

    const updatedUser = await User.findById(userId).populate({
      path: "wishlist.product",
      select: "name price images stock category slug",
      populate: {
        path: "category",
        select: "name slug",
      },
    });

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist successfully",
      data: updatedUser.wishlist,
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Error removing from wishlist",
    });
  }
};

// Get wishlist
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate({
      path: "wishlist.product",
      select: "name price images stock category slug",
      populate: {
        path: "category",
        select: "name slug",
      },
    });

    res.status(200).json({
      success: true,
      data: user.wishlist,
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching wishlist",
    });
  }
};

// Clear wishlist
exports.clearWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    user.wishlist = [];
    await user.save();

    res.status(200).json({
      success: true,
      message: "Wishlist cleared successfully",
      data: [],
    });
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Error clearing wishlist",
    });
  }
};
