const Product = require("../models/Product");
const Order = require("../models/Order");

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Public (temporarily for testing)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Get recent orders
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email");

    // Get low stock products
    const lowStockProducts = await Product.find({
      stock: { $lt: 10 },
    }).limit(10);

    res.json({
      success: true,
      data: {
        stats: {
          totalProducts,
          totalOrders,
        },
        recentOrders,
        lowStockProducts,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
