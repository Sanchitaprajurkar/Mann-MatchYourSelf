const Review = require("../models/Review");
const Order = require("../models/Order");

// Submit a review
exports.submitReview = async (req, res) => {
  try {
    const { token, rating, comment } = req.body;

    if (!token || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const order = await Order.findOne({ reviewToken: token }).populate("items.product");

    if (!order) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Create review for each product in order
    // Note: The user prompt asked to create a review linked to userId, productId, orderId.
    // If an order has multiple products, should we create one review per product?
    // The prompt says "Create review linked to ... productId".
    // And "Create review for each product in order" in STEP 6 code provided by user.
    
    // However, usually user reviews specific products.
    // But if the token is for the whole order, and the UI just takes one rating/comment...
    // The user's code snippet:
    // for (let item of order.products) { await Review.create({...}) }
    // This implies one rating applies to all products in the order? That's a bit duplicate, but I will follow the user's request.
    
    const reviews = [];
    for (let item of order.items) {
       // Check if already reviewed? The token is one-time use so it should be fine.
       const review = await Review.create({
        userId: order.user,
        productId: item.product._id || item.product, // Handle populated or not
        orderId: order._id,
        rating,
        comment,
        status: "pending" // Default
      });
      reviews.push(review);
    }

    order.reviewToken = null; // prevent reuse
    await order.save();

    res.json({ success: true, message: "Review submitted successfully", reviews });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get reviews for a product
exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({
      productId,
      status: "approved"
    }).populate("userId", "name").sort({ createdAt: -1 });

    res.json({ success: true, data: reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Admin: Get all pending reviews
exports.getPendingReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: "pending" })
      .populate("userId", "name email")
      .populate("productId", "name")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (error) {
    console.error("Error fetching pending reviews:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Admin: Approve/Reject review
exports.updateReviewStatus = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { status } = req.body; // approved or rejected

    if (!["approved", "rejected", "pending"].includes(status)) {
       return res.status(400).json({ message: "Invalid status" });
    }

    const review = await Review.findByIdAndUpdate(
      reviewId, 
      { status }, 
      { new: true }
    );

    if (!review) {
        return res.status(404).json({ message: "Review not found" });
    }

    res.json({ success: true, message: `Review ${status}`, data: review });
  } catch (error) {
    console.error("Error updating review status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
