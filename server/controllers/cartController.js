const User = require("../models/User");
const Product = require("../models/Product");

// Add item to cart
exports.addToCartNew = async (req, res) => {
  console.log("🚨 ADDTOCARTNEW FUNCTION CALLED - THIS SHOULD ALWAYS SHOW");
  try {
    console.log("🛒 ADD TO CART HIT");
    console.log("🛒 USER:", req.user?.id);
    console.log("🛒 BODY:", req.body);

    const { productId, quantity = 1, size, color } = req.body;
    const userId = req.user.id;

    if (!productId || !quantity) {
      console.log("❌ Missing productId or quantity");
      return res.status(400).json({
        success: false,
        message: "Missing productId or quantity",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("🛒 Current cart:", user.cart);

    const existingItemIndex = user.cart.findIndex(
      (item) => 
        item.product.toString() === productId && 
        (item.size === size || (!item.size && !size)) &&
        (item.color === color || (!item.color && !color))
    );

    if (existingItemIndex > -1) {
      // Update quantity
      user.cart[existingItemIndex].quantity += parseInt(quantity);
      console.log("🛒 Updated existing item quantity");
    } else {
      // Add new item
      user.cart.push({
        product: productId,
        quantity: parseInt(quantity),
        size,
        color,
        addedAt: new Date(),
      });
      console.log("🛒 Added new item to cart");
    }

    await user.save();
    console.log("🛒 Cart saved successfully:", user.cart);

    res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      data: user.cart,
    });
  } catch (error) {
    console.error("🛒 ADD TO CART ERROR:", error);
    console.error("🛒 ERROR STACK:", error.stack);
    res.status(500).json({
      success: false,
      message: "Error adding to cart",
      error: error.message,
    });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    console.log("🛒 UPDATE CART ITEM HIT");
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const user = await User.findById(userId);
    const cartItemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (cartItemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    user.cart[cartItemIndex].quantity = parseInt(quantity);
    await user.save();

    console.log("🛒 Cart item updated successfully");

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      data: user.cart,
    });
  } catch (error) {
    console.error("🛒 UPDATE CART ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Error updating cart",
      error: error.message,
    });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    console.log("🛒 REMOVE FROM CART HIT");
    const { productId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const originalLength = user.cart.length;

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId,
    );

    await user.save();

    console.log(
      `🛒 Removed item from cart. Items: ${originalLength} → ${user.cart.length}`,
    );

    res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
      data: user.cart,
    });
  } catch (error) {
    console.error("🛒 REMOVE FROM CART ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Error removing from cart",
      error: error.message,
    });
  }
};

// Get cart
exports.getCart = async (req, res) => {
  try {
    console.log("🛒 GET CART HIT");
    console.log("🛒 USER:", req.user?.id);

    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("🛒 Raw cart from DB:", user.cart);

    // Try to populate product details, but handle missing products gracefully
    let populatedCart = [];
    try {
      const userWithCart = await User.findById(userId).populate({
        path: "cart.product",
        select: "name price images stock description",
      });
      populatedCart = userWithCart.cart;
      console.log("🛒 Populated cart:", populatedCart);
    } catch (populateError) {
      console.log("⚠️ Could not populate products, returning raw cart");
      populatedCart = user.cart;
    }

    res.status(200).json({
      success: true,
      data: populatedCart,
    });
  } catch (error) {
    console.error("🛒 GET CART ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching cart",
      error: error.message,
    });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    console.log("🛒 CLEAR CART HIT");
    const userId = req.user.id;

    const user = await User.findById(userId);
    const originalLength = user.cart.length;
    user.cart = [];
    await user.save();

    console.log(`🛒 Cart cleared. Had ${originalLength} items`);

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: [],
    });
  } catch (error) {
    console.error("🛒 CLEAR CART ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Error clearing cart",
      error: error.message,
    });
  }
};

// Sync localStorage cart to backend
exports.syncCart = async (req, res) => {
  try {
    console.log("🛒 SYNC CART HIT");
    console.log("🛒 Request body:", req.body);
    console.log("🛒 User ID:", req.user?.id);

    const { items } = req.body;
    const userId = req.user.id;

    console.log("📤 Syncing cart to backend for user:", userId);
    console.log("📤 Items to sync:", items);

    // Simple validation and mapping
    const validatedItems = [];
    if (items && Array.isArray(items)) {
      console.log("📤 Processing items array...");
      for (const item of items) {
        console.log("📤 Processing item:", item);
        const pid = item.productId || item.product;
        if (pid && item.quantity > 0) {
          const validatedItem = {
            product: pid,
            quantity: parseInt(item.quantity),
            size: item.size || undefined,
            color: item.color || undefined,
            addedAt: new Date(),
          };
          validatedItems.push(validatedItem);
          console.log("📤 Validated item:", validatedItem);
        } else {
          console.log("⚠️ Skipping invalid item:", item);
        }
      }
    } else {
      console.log("⚠️ Items is not a valid array:", items);
    }

    console.log("📤 Final validated items:", validatedItems);

    // Load user and update cart with proper save
    const user = await User.findById(userId);
    if (!user) {
      console.log("❌ User not found during sync");
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update user cart and save
    user.cart = validatedItems;
    await user.save();

    console.log("📤 Cart synced successfully to user:", user._id);
    console.log("📤 User cart after save:", user.cart.length, "items");

    res.status(200).json({
      success: true,
      message: "Cart synced successfully",
      data: validatedItems,
    });
  } catch (error) {
    console.error("📤 SYNC CART ERROR:", error);
    console.error("📤 ERROR STACK:", error.stack);
    res.status(500).json({
      success: false,
      message: "Cart sync failed",
      error: error.message,
    });
  }
};
