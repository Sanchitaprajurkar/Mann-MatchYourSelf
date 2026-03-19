const Order = require("../models/Order");
const User = require("../models/User");

const syncCart = async (req, res) => {
  try {
    console.log("🛒 SYNC CART HIT");
    console.log("🛒 USER:", req.user);
    console.log("🛒 CART ITEMS:", req.body.items);

    const user = await User.findById(req.user._id);

    if (!user) {
      console.log("❌ USER NOT FOUND");
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update cart with items from frontend
    user.cart = req.body.items || [];
    await user.save();

    console.log("✅ CART SYNCED, USER CART LENGTH:", user.cart.length);

    res.status(200).json({
      success: true,
      message: "Cart synced successfully",
      data: user.cart,
    });
  } catch (error) {
    console.error("❌ SYNC CART ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to sync cart",
      error: error.message,
    });
  }
};

const createOrder = async (req, res) => {
  try {
    console.log("🛒 CREATE ORDER HIT");
    console.log("🛒 USER:", req.user);
    console.log("🛒 USER ID:", req.user?.id);
    console.log("🛒 REQUEST BODY:", req.body);

    console.log("🔍 Loading user with cart...");
    const user = await User.findById(req.user.id).populate("cart.product");
    console.log("🔍 User loaded:", !!user);
    console.log("🔍 User cart exists:", !!user?.cart);
    console.log("🔍 User cart length:", user?.cart?.length);
    console.log("🔍 User cart contents:", user?.cart);

    // 🛡️ SAFETY CHECK: Prevent empty orders
    if (!user || !user.cart || user.cart.length === 0) {
      console.log("❌ CART IS EMPTY OR USER NOT FOUND");
      console.log("❌ User exists:", !!user);
      console.log("❌ Cart exists:", !!user?.cart);
      console.log("❌ Cart length:", user?.cart?.length);
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    console.log("🛒 USER FOUND:", !!user);
    console.log("🛒 USER CART:", user?.cart);
    console.log("🛒 USER CART LENGTH:", user?.cart?.length);

    const { shippingAddress } = req.body;

    console.log("🛒 Shipping Address:", shippingAddress);

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    const orderItems = user.cart.map((cartItem) => ({
      product: cartItem.product._id,
      name: cartItem.product.name,
      image: cartItem.product.images?.[0] || "",
      price: cartItem.product.price,
      quantity: cartItem.quantity,
    }));

    console.log("🛒 ORDER ITEMS CREATED:", orderItems);

    const totalAmount = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    console.log("🛒 TOTAL AMOUNT:", totalAmount);

    // Create order with payment-ready fields
    const order = new Order({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      paymentMethod: "COD",
      paymentStatus: "Pending",
      totalAmount,
      orderStatus: "Placed",
      status: "PLACED", // Legacy field for backward compatibility
    });

    console.log("🛒 ORDER OBJECT CREATED WITH PAYMENT FIELDS:", {
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
    });

    try {
      const createdOrder = await order.save();

      await User.updateOne(
        { _id: user._id },
        { $set: { cart: [] } }
      );

      console.log("🛒 ORDER CREATED SUCESSFULLY:", createdOrder._id);
      console.log("🛒 ORDER DETAILS:", {
        id: createdOrder._id,
        user: createdOrder.user,
        itemCount: createdOrder.items.length,
        total: createdOrder.totalAmount,
        status: createdOrder.status,
      });

      res.status(201).json({
        success: true,
        message: "Order placed successfully",
        data: createdOrder,
      });
    } catch (saveError) {
      console.error("❌ ORDER SAVE ERROR:", saveError);
      throw saveError;
    }
  } catch (error) {
    console.log("❌ FULL CREATE ORDER ERROR:", error);
    console.log("❌ ERROR STACK:", error.stack);
    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
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

    res.status(200).json({
      success: true,
      data: order,
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
