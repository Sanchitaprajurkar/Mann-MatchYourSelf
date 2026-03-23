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

// Admin: Get all reviews (including hidden)
exports.getAdminReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate("userId", "name email")
      .populate("productId", "name")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (error) {
    console.error("Error fetching admin reviews:", error);
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

// Admin: Approve review (Specifically handled for rating recalculations)
exports.approveReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndUpdate(
      id,
      { status: "approved", isApproved: true },
      { new: true }
    );

    if (!review) return res.status(404).json({ message: "Review not found" });

    // Auto-update product rating
    const approvedReviews = await Review.find({ productId: review.productId, status: "approved" });
    const avg = approvedReviews.length > 0
      ? approvedReviews.reduce((acc, r) => acc + r.rating, 0) / approvedReviews.length
      : 0;

    await Order.mongoose?.model('Product').findByIdAndUpdate(review.productId, {
      averageRating: avg,
      numReviews: approvedReviews.length,
    }).catch(e => {
        // Fallback if Product model isn't populated nicely
        const Product = require("../models/Product");
        return Product.findByIdAndUpdate(review.productId, { averageRating: avg, numReviews: approvedReviews.length });
    });

    res.json({ success: true, data: review, message: "Review approved and rating updated" });
  } catch (error) {
    console.error("Error approving review:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Create a new general review
exports.createReview = async (req, res) => {
  console.log("REVIEW BODY:", req.body);
  try {
    const { productId, name, location, rating, comment, userId } = req.body;
    let imageUrl = "";

    // If an image was uploaded via multipart/form-data
    if (req.file) {
      imageUrl = req.file.path;
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    let isVerified = false;

    // Check verified buyer logic
    if (userId) {
      // Find if this user has any order containing this product
      const Order = require("../models/Order");
      const hasPurchased = await Order.findOne({
        user: userId,
        "items.product": productId
      });
      if (hasPurchased) {
        isVerified = true;
      }
    }

    const review = await Review.create({
      productId,
      userId: userId || undefined,
      name,
      location: location || "",
      rating: Number(rating) || 5,
      comment,
      image: imageUrl,
      isVerified,
      isApproved: false,
      status: "pending"
    });

    res.status(201).json({ success: true, data: review, message: "Review submitted successfully" });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all reviews (for homepage, hidden false)
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: "approved" })
      .populate("userId", "name")
      .populate("productId", "name")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, data: reviews });
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Admin: Hide review
exports.hideReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isHidden: true },
      { new: true }
    );
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json({ success: true, data: review, message: "Review hidden successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Admin: Unhide review
exports.unhideReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isHidden: false },
      { new: true }
    );
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json({ success: true, data: review, message: "Review unhidden successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
