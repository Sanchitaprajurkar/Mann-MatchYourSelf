const Order = require("../models/Order");
const crypto = require("crypto");
const sendReviewEmail = require("../utils/sendReviewEmail");

exports.getAllOrders = async (req, res) => {
  try {
    console.log("📦 ADMIN: Fetching all orders");
    console.log("📦 ADMIN USER:", req.user);
    
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price images")
      .sort({ createdAt: -1 });

    console.log(`📦 ADMIN: Found ${orders.length} orders`);
    
    if (orders.length > 0) {
      console.log("📦 ADMIN: Sample order:", {
        id: orders[0]._id,
        user: orders[0].user,
        itemCount: orders[0].items.length,
        total: orders[0].totalAmount,
        status: orders[0].status,
      });
    }

    res.json({ success: true, data: orders, count: orders.length });
  } catch (err) {
    console.error("📦 ADMIN: Error fetching orders:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch orders",
      error: err.message 
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    console.log(`📦 ADMIN: Updating order ${req.params.id} to status: ${status}`);

    const allowed = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid status" 
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      console.log("📦 ADMIN: Order not found");
      return res.status(404).json({ 
        success: false,
        message: "Order not found" 
      });
    }

    order.status = status;

    if (status === "DELIVERED" && !order.reviewEmailSent) {
      const token = crypto.randomBytes(32).toString("hex");
      order.reviewToken = token;

      // Populate user to get email
      await order.populate("user");

      if (order.user && order.user.email) {
        await sendReviewEmail(
          order.user.email,
          order.user.name || "Customer",
          token
        );
        order.reviewEmailSent = true;
      }
    }

    await order.save();

    console.log("📦 ADMIN: Order status updated successfully");
    res.json({ success: true, data: order });
  } catch (err) {
    console.error("📦 ADMIN: Error updating status:", err);
    res.status(500).json({ 
      success: false,
      message: "Status update failed",
      error: err.message 
    });
  }
};
