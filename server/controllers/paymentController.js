const { razorpayInstance } = require("../config/razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

/**
 * CREATE RAZORPAY ORDER
 * @route POST /api/payment/create-order
 * @desc Create a Razorpay order for payment
 * @access Private
 */
exports.createRazorpayOrder = async (req, res) => {
  try {
    console.log("\n💳 ===== CREATE RAZORPAY ORDER START =====");
    const { orderId } = req.body;
    console.log("📦 orderId received:", orderId);

    if (!orderId) {
      console.log("❌ No orderId in request body");
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const order = await Order.findById(orderId);
    console.log("🔍 DB order found:", !!order);

    if (!order) {
      console.log("❌ Order not found in DB for id:", orderId);
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    console.log("📊 Order details: totalAmount=", order.totalAmount, "paymentStatus=", order.paymentStatus, "orderNumber=", order.orderNumber);

    if (order.paymentStatus === "Paid") {
      console.log("❌ Order already paid");
      return res.status(400).json({
        success: false,
        message: "Order is already paid",
      });
    }

    const amountInPaise = Math.round(order.totalAmount * 100);
    console.log("💰 Amount in paise:", amountInPaise);

    if (!amountInPaise || amountInPaise < 100) {
      console.log("❌ Invalid amount — totalAmount is", order.totalAmount, "→ paise:", amountInPaise);
      return res.status(400).json({
        success: false,
        message: `Invalid order amount: ₹${order.totalAmount}. Minimum is ₹1.`,
      });
    }

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${orderId}`,
      notes: {
        orderId: orderId,
        orderNumber: order.orderNumber,
      },
    };

    if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.includes("xxxxxxxxxx")) {
      return res.status(500).json({
        success: false,
        message: "Razorpay credentials not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env",
      });
    }

    console.log("🚀 Calling Razorpay API with options:", JSON.stringify(options));
    const razorpayOrder = await razorpayInstance.orders.create(options);
    console.log("✅ Razorpay order created:", razorpayOrder.id);

    order.razorpayOrderId = razorpayOrder.id;
    // orderStatus remains "Placed" - payment status tracks payment state
    await order.save();

    res.status(200).json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      orderId: orderId,
    });
    console.log("===== CREATE RAZORPAY ORDER END =====\n");
  } catch (error) {
    console.error("\n❌ CREATE RAZORPAY ORDER ERROR:", error.message);
    console.error("❌ Error name:", error.name);
    console.error("❌ Status code:", error.statusCode);
    if (error.error) {
      console.error("❌ Razorpay error body:", JSON.stringify(error.error));
      console.error("❌ Razorpay error description:", error.error.description);
    }
    console.error("❌ Full stack:", error.stack);
    
    // Return more detailed error to frontend
    const errorMessage = error.error?.description || error.message || "Razorpay order creation failed";
    
    res.status(500).json({
      success: false,
      message: errorMessage,
      error: error.message,
      details: error.error?.description || null,
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
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return res.status(400).json({
        success: false,
        message: "All payment details are required",
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, paymentStatus: { $ne: "Paid" } },
      {
        paymentStatus: "Paid",
        paymentMethod: "ONLINE",
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        orderStatus: "Placed"
      },
      { new: true }
    );

    if (!updatedOrder) {
      // It is already paid or doesn't exist. If it's already paid by webhook securely, we just return success.
      const existing = await Order.findById(orderId);
      if (existing && existing.paymentStatus === "Paid") {
        return res.status(200).json({
          success: true,
          message: "Payment verified successfully (was already processed by webhook)",
          order: {
            id: existing._id,
            orderNumber: existing.orderNumber,
            paymentStatus: existing.paymentStatus,
            paymentMethod: existing.paymentMethod,
          },
        });
      }

      return res.status(404).json({
        success: false,
        message: "Order not found or verification mismatch",
      });
    }

    // Since we just changed it to "Paid", we must clear cart and deduct stock
    await User.updateOne({ _id: updatedOrder.user }, { $set: { cart: [] } });
    for (const item of updatedOrder.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

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
    console.error("VERIFY PAYMENT ERROR:", error.message);
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

/**
 * RAZORPAY WEBHOOK
 * @route POST /api/payment/webhook
 * @desc Handle Razorpay webhooks for backup confirmation
 * @access Public
 */
exports.razorpayWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    if (!secret) {
      console.log("Webhook skipped: RAZORPAY_WEBHOOK_SECRET not set in .env");
      return res.status(200).send("OK");
    }

    const signature = req.headers["x-razorpay-signature"];
    
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("Invalid Webhook Signature");
      return res.status(400).send("Invalid signature");
    }

    const event = req.body.event;
    
    if (event === "payment.captured" || event === "order.paid") {
      const paymentEntity = req.body.payload.payment.entity;
      const razorpayOrderId = paymentEntity.order_id;
      const razorpayPaymentId = paymentEntity.id;

      const updatedOrder = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpayOrderId, paymentStatus: { $ne: "Paid" } },
        {
          paymentStatus: "Paid",
          paymentMethod: "ONLINE",
          razorpayPaymentId: razorpayPaymentId,
          orderStatus: "Placed"
        },
        { new: true }
      );
      
      if (updatedOrder) {
         console.log(`Webhook: Order ${updatedOrder.orderNumber} marked as Paid.`);
         await User.updateOne({ _id: updatedOrder.user }, { $set: { cart: [] } });
         for (const item of updatedOrder.items) {
           await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
         }
      }
    } else if (event === "payment.failed") {
      const paymentEntity = req.body.payload.payment.entity;
      await Order.findOneAndUpdate(
        { razorpayOrderId: paymentEntity.order_id, paymentStatus: { $ne: "Paid" } },
        {
           paymentStatus: "Failed",
           paymentFailureReason: paymentEntity.error_description || "Payment failed",
        }
      );
      console.log(`Webhook: Payment failed for Order ID: ${paymentEntity.order_id}`);
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("WEBHOOK ERROR:", error.message);
    res.status(500).send("Webhook Error");
  }
};
