const Order = require("../models/Order");
const User = require("../models/User");
const Coupon = require("../models/Coupon");
const Product = require("../models/Product");

const GST_THRESHOLD_PER_PIECE = 2500;
const GST_LOWER_RATE = 0.05;
const GST_HIGHER_RATE = 0.18;

const getGstRateForPiece = (piecePrice) =>
  piecePrice <= GST_THRESHOLD_PER_PIECE ? GST_LOWER_RATE : GST_HIGHER_RATE;

const calculateGstAmount = (orderItems) =>
  Math.round(
    orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity * getGstRateForPiece(item.price),
      0,
    ),
  );

// Valid order status constants
const ORDER_STATUS = {
  PLACED: "Placed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const VALID_ORDER_STATUSES = Object.values(ORDER_STATUS);

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
    console.log("\n🛒 ===== CREATE ORDER START =====");
    console.log("👤 User ID:", req.user.id);
    console.log("📦 Request body keys:", Object.keys(req.body));

    const user = await User.findById(req.user.id).populate("cart.product");

    if (!user) {
      console.log("❌ User not found in DB");
      return res.status(400).json({ success: false, message: "User not found" });
    }

    console.log("🛒 DB cart length:", user.cart?.length || 0);
    if (user.cart?.length > 0) {
      user.cart.forEach((ci, i) => {
        console.log(`  Cart[${i}]: product=${ci.product?._id || 'NULL'}, name=${ci.product?.name || 'N/A'}, qty=${ci.quantity}, hasImages=${!!(ci.product?.images?.length)}`);
      });
    }

    if (!user.cart || user.cart.length === 0) {
      console.log("❌ Cart is empty in DB — was /api/cart/sync called?");
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const { shippingAddress, paymentMethod, couponCode } = req.body;
    console.log("💳 Payment method:", paymentMethod);
    console.log("🏷️  Coupon code:", couponCode || "none");
    console.log("📍 Shipping address:", JSON.stringify(shippingAddress, null, 2));

    if (!shippingAddress) {
      console.log("❌ No shipping address provided");
      return res.status(400).json({ success: false, message: "Shipping address is required" });
    }

    const normalizedShippingAddress = {
      ...shippingAddress,
      city: shippingAddress.city || "",
      state: shippingAddress.state || "",
      postalCode: shippingAddress.postalCode || shippingAddress.pincode || "",
      pincode: shippingAddress.pincode || shippingAddress.postalCode || "",
      country: shippingAddress.country || "India",
    };

    const orderItems = user.cart
      .filter((ci) => ci.product)
      .map((ci) => ({
        product: ci.product._id,
        name: ci.product.name,
        image: ci.product.images?.[0] || "/placeholder-product.jpg",
        price: ci.product.price,
        quantity: ci.quantity,
        size: ci.size,
        color: ci.color,
      }));

    console.log("📋 Order items mapped:", orderItems.length);
    orderItems.forEach((item, i) => {
      console.log(`  Item[${i}]: ${item.name}, price=${item.price}, qty=${item.quantity}, image=${item.image ? 'YES' : '⚠️ EMPTY'}, size=${item.size || 'N/A'}`);
    });

    if (orderItems.length === 0) {
      console.log("❌ All cart products were null after populate");
      return res.status(400).json({ success: false, message: "No valid products in cart" });
    }

    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const gstAmount = calculateGstAmount(orderItems);
    const shippingFee = subtotal > 500 ? 0 : 50;
    const platformFee = 0;

    let couponDiscount = 0;
    let couponSnapshot = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase().trim() });
      const now = new Date();

      const isValid =
        coupon &&
        coupon.isActive &&
        (!coupon.validFrom || new Date(coupon.validFrom) <= now) &&
        (!coupon.validTill || new Date(coupon.validTill) >= now) &&
        (!coupon.minOrderAmount || subtotal >= coupon.minOrderAmount) &&
        (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit);

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
      }
    }

    const totalAmount = Math.max(
      0,
      subtotal + gstAmount - couponDiscount + shippingFee + platformFee,
    );

    const pricingSnapshot = {
      subtotal,
      productDiscount: 0,
      couponDiscount: Math.round(couponDiscount),
      gstAmount,
      shippingFee,
      platformFee,
      totalAmount: Math.round(totalAmount),
    };

    const isOnline = paymentMethod && paymentMethod.toUpperCase() === "ONLINE";

    const order = new Order({
      user: req.user.id,
      items: orderItems,
      shippingAddress: normalizedShippingAddress,
      paymentMethod: isOnline ? "ONLINE" : "COD",
      paymentStatus: "Pending",
      totalAmount: Math.round(totalAmount),
      orderStatus: ORDER_STATUS.PLACED,
      status: "PLACED",
      ...(couponSnapshot && { appliedCoupon: couponSnapshot }),
      pricingSnapshot,
    });

    const createdOrder = await order.save();

    if (couponSnapshot) {
      await Coupon.findByIdAndUpdate(couponSnapshot.couponId, { $inc: { usedCount: 1 } });
    }

    if (!isOnline) {
      // COD Order: Clear cart & deduct stock immediately
      await User.updateOne({ _id: user._id }, { $set: { cart: [] } });
      for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
      }
    }

    const plainOrder = createdOrder.toObject();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: plainOrder,
    });
    console.log("✅ Order created successfully:", createdOrder._id, "| orderNumber:", createdOrder.orderNumber);
    console.log("===== CREATE ORDER END =====\n");
  } catch (error) {
    console.error("\n❌ CREATE ORDER ERROR:", error.message);
    if (error.name === 'ValidationError') {
      console.error("❌ Validation details:", JSON.stringify(error.errors, null, 2));
    }
    console.error("❌ Full stack:", error.stack);
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
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.user._id.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to view this order" });
    }

    res.status(200).json({ success: true, data: order.toObject() });
  } catch (error) {
    res.status(500).json({ success: false, message: "Order fetch failed", error: error.message });
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
    const { status, orderStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update legacy status field if provided
    if (status) order.status = status.toUpperCase();

    // Update orderStatus with validation and normalization
    let newStatus = orderStatus || status;

    if (newStatus) {
      // Normalize common frontend inputs to valid enum values
      const statusMapping = {
        'pending': 'Placed',
        'processing': 'Shipped', // If frontend sends processing, map to Shipped
        'cancelled': 'Cancelled',
        'delivered': 'Delivered',
        'shipped': 'Shipped',
        'placed': 'Placed'
      };

      // First try direct mapping, then normalize case
      newStatus = statusMapping[newStatus.toLowerCase()] ||
                  (newStatus.charAt(0).toUpperCase() + newStatus.slice(1).toLowerCase());

      console.log("🔥 Attempting to update orderStatus to:", newStatus);

      // Validate against allowed enum values
      if (!VALID_ORDER_STATUSES.includes(newStatus)) {
        console.error("❌ Invalid orderStatus attempted:", newStatus);
        return res.status(400).json({
          success: false,
          message: `Invalid order status: "${newStatus}". Allowed values are: ${VALID_ORDER_STATUSES.join(", ")}`,
          allowedStatuses: VALID_ORDER_STATUSES,
        });
      }

      console.log("✅ Valid orderStatus, updating to:", newStatus);
      order.orderStatus = newStatus;
    }

    await order.save();

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("❌ Order update error:", error);
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
