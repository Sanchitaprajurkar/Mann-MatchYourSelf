const { razorpayInstance } = require("../config/razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");

/**
 * CREATE RAZORPAY ORDER
 * @route POST /api/payment/create-order
 * @desc Create a Razorpay order for payment
 * @access Private
 */
exports.createRazorpayOrder = async (req, res) => {
  try {
    console.log("💳 CREATE RAZORPAY ORDER REQUEST");
    const { orderId } = req.body;
    console.log("💳 Order ID:", orderId);

    // Validate input
    if (!orderId) {
      console.log("💳 ERROR: Order ID missing");
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    // Fetch order from database
    console.log("💳 Fetching order from database...");
    const order = await Order.findById(orderId);

    if (!order) {
      console.log("💳 ERROR: Order not found");
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    console.log("💳 Order found:", {
      id: order._id,
      totalAmount: order.totalAmount,
      paymentStatus: order.paymentStatus,
    });

    // Check if order is already paid
    if (order.paymentStatus === "Paid") {
      console.log("💳 ERROR: Order already paid");
      return res.status(400).json({
        success: false,
        message: "Order is already paid",
      });
    }

    // Create Razorpay order options
    const options = {
      amount: order.totalAmount * 100, // Convert to paise (smallest currency unit)
      currency: "INR",
      receipt: `receipt_${orderId}`,
      notes: {
        orderId: orderId,
        orderNumber: order.orderNumber,
      },
    };

    console.log("💳 Creating Razorpay order with options:", options);

    // Create Razorpay order
    const razorpayOrder = await razorpayInstance.orders.create(options);

    console.log("💳 ✅ Razorpay order created successfully");
    console.log("💳 Razorpay Order ID:", razorpayOrder.id);

    // Return Razorpay order details
    res.status(200).json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      orderId: orderId,
    });
  } catch (error) {
    console.error("💳 ❌ CREATE RAZORPAY ORDER ERROR:", error);
    console.error("💳 Error message:", error.message);
    res.status(500).json({
      success: false,
      message: "Razorpay order creation failed",
      error: error.message,
    });
  }
};

/**
 * VERIFY PAYMENT
 * @route POST /api/payment/verify-payment
 * @desc Verify Razorpay payment signature and update order
 * @access Private
 */
exports.verifyPayment = async (req, res) => {
  try {
    console.log("💳 VERIFY PAYMENT REQUEST");
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    console.log("💳 Payment details:", {
      razorpay_order_id,
      razorpay_payment_id,
      orderId,
    });

    // Validate input
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !orderId
    ) {
      console.log("💳 ERROR: Missing required fields");
      return res.status(400).json({
        success: false,
        message: "All payment details are required",
      });
    }

    // Create signature verification string
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    // Generate expected signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    console.log("💳 Signature verification:", {
      received: razorpay_signature.substring(0, 20) + "...",
      expected: expectedSignature.substring(0, 20) + "...",
      match: expectedSignature === razorpay_signature,
    });

    // Verify signature
    if (expectedSignature !== razorpay_signature) {
      console.log("💳 ❌ ERROR: Invalid signature");
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    console.log("💳 ✅ Signature verified successfully");

    // Update order in database
    console.log("💳 Updating order in database...");
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: "Paid",
        paymentMethod: "ONLINE",
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      },
      { new: true }
    );

    if (!updatedOrder) {
      console.log("💳 ERROR: Order not found for update");
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    console.log("💳 ✅ Order updated successfully:", {
      orderId: updatedOrder._id,
      paymentStatus: updatedOrder.paymentStatus,
      paymentMethod: updatedOrder.paymentMethod,
    });

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order: {
        id: updatedOrder._id,
        orderNumber: updatedOrder.orderNumber,
        paymentStatus: updatedOrder.paymentStatus,
        paymentMethod: updatedOrder.paymentMethod,
      },
    });
  } catch (error) {
    console.error("💳 ❌ VERIFY PAYMENT ERROR:", error);
    console.error("💳 Error message:", error.message);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};

/**
 * GET RAZORPAY KEY
 * @route GET /api/payment/key
 * @desc Get Razorpay key for frontend
 * @access Public
 */
exports.getRazorpayKey = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("💳 ❌ GET KEY ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get Razorpay key",
    });
  }
};
