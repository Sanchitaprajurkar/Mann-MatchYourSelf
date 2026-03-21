const Order = require("../models/Order");
const User = require("../models/User");
const Coupon = require("../models/Coupon");

const syncCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    user.cart = req.body.items || [];
    await user.save();
    res.status(200).json({ success: true, message: "Cart synced successfully", data: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to sync cart", error: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.product");

    if (!user || !user.cart || user.cart.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const { shippingAddress, paymentMethod, couponCode } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ success: false, message: "Shipping address is required" });
    }

    // Build order items from user's DB cart (never trust frontend items)
    const orderItems = user.cart
      .filter((ci) => ci.product) // skip orphaned refs
      .map((ci) => ({
        product: ci.product._id,
        name: ci.product.name,
        image: ci.product.images?.[0] || "",
        price: ci.product.price,
        quantity: ci.quantity,
      }));

    if (orderItems.length === 0) {
      return res.status(400).json({ success: false, message: "No valid products in cart" });
    }

    // ── Server-side pricing computation ──────────────────────────
    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = subtotal > 500 ? 0 : 50;
    const platformFee = 10;

    let couponDiscount = 0;
    let couponSnapshot = null;

    // Revalidate coupon if provided
    if (couponCode) {
      console.log("🏷️  Coupon code received:", couponCode);
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase().trim() });
      const now = new Date();

      const isValid =
        coupon &&
        coupon.isActive &&
        (!coupon.validFrom || new Date(coupon.validFrom) <= now) &&
        (!coupon.validTill || new Date(coupon.validTill) >= now) &&
        (!coupon.minOrderAmount || subtotal >= coupon.minOrderAmount) &&
        (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit);

      console.log("🏷️  Coupon found:", !!coupon, "| isValid:", isValid);

      if (isValid) {
        if (coupon.discountType === "percentage") {
          couponDiscount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscountAmount) couponDiscount = Math.min(couponDiscount, coupon.maxDiscountAmount);
        } else if (coupon.discountType === "flat") {
          couponDiscount = coupon.discountValue;
        }
        couponDiscount = Math.min(couponDiscount, subtotal);

        couponSnapshot = {
          couponId: coupon._id,
          code: coupon.code,
          title: coupon.title,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          discountAmount: Math.round(couponDiscount),
        };
        console.log("🏷️  Coupon snapshot:", couponSnapshot);
      }
    }

    const totalAmount = Math.max(0, subtotal - couponDiscount + shippingFee + platformFee);

    const pricingSnapshot = {
      subtotal,
      productDiscount: 0,
      couponDiscount: Math.round(couponDiscount),
      shippingFee,
      platformFee,
      totalAmount: Math.round(totalAmount),
    };
    // ─────────────────────────────────────────────────────────────

    const order = new Order({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      paymentMethod: paymentMethod === "cod" ? "COD" : "COD",
      paymentStatus: "Pending",
      totalAmount: Math.round(totalAmount),
      orderStatus: "Placed",
      status: "PLACED",
      ...(couponSnapshot && { appliedCoupon: couponSnapshot }),
      pricingSnapshot,
    });

    console.log("📦 Order about to save - appliedCoupon:", order.appliedCoupon);
    console.log("📦 Order about to save - pricingSnapshot:", order.pricingSnapshot);

    const createdOrder = await order.save();

    // Increment coupon usage count after successful save
    if (couponSnapshot) {
      await Coupon.findByIdAndUpdate(couponSnapshot.couponId, { $inc: { usedCount: 1 } });
    }

    // Clear user's backend cart
    await User.updateOne({ _id: user._id }, { $set: { cart: [] } });

    // Convert to plain object so all nested fields (appliedCoupon, pricingSnapshot) serialize properly
    const plainOrder = createdOrder.toObject();
    console.log("✅ Order saved - appliedCoupon in response:", plainOrder.appliedCoupon);
    console.log("✅ Order saved - pricingSnapshot in response:", plainOrder.pricingSnapshot);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: plainOrder,
    });
  } catch (error) {
    console.error("❌ CREATE ORDER ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product", "name price images")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Cannot fetch orders",
      error: error.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product", "name price images");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.user._id.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order",
      });
    }

    const plainOrder = order.toObject();
    console.log("📋 getOrderById - appliedCoupon:", plainOrder.appliedCoupon);
    console.log("📋 getOrderById - pricingSnapshot:", plainOrder.pricingSnapshot);

    res.status(200).json({
      success: true,
      data: plainOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Order fetch failed",
      error: error.message,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    console.log("🔍 Admin fetching all orders...");
    const orders = await Order.find({})
      .populate("user", "name email")
      .populate("items.product", "name price images")
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${orders.length} orders`);
    if (orders.length > 0) {
      console.log("📝 First order user:", orders[0].user);
    } else {
      console.log("⚠️ No orders found in DB");
    }

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("❌ Error fetching all orders:", error);
    res.status(500).json({
      success: false,
      message: "Cannot fetch orders",
      error: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Order update failed",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  syncCart,
};
