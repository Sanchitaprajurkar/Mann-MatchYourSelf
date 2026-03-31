const mongoose = require("mongoose");
const Review = require("../models/Review.model");
const Product = require("../models/Product");
const Order = require("../models/Order");
const {
  uploadBufferToCloudinary,
  destroyCloudinaryAsset,
} = require("../utils/cloudinary");

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;
const REVIEW_IMAGE_FOLDER = "mannmatch/reviews";

const toObjectId = (value) => new mongoose.Types.ObjectId(value);

const normalizeList = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((entry) => String(entry).trim())
      .filter(Boolean);
  }

  return String(value)
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
};

const parseImagesPayload = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const serializeReview = (review) => {
  const data = review.toObject ? review.toObject() : review;
  const user = data.userId && typeof data.userId === "object" ? data.userId : null;
  const product =
    data.productId && typeof data.productId === "object" ? data.productId : null;

  return {
    _id: String(data._id),
    productId: product
      ? {
          _id: String(product._id),
          name: product.name,
          images: product.images || [],
        }
      : String(data.productId),
    userId: user
      ? {
          _id: String(user._id),
          name: user.name,
        }
      : String(data.userId),
    userName: data.userName,
    name: data.userName,
    rating: data.rating,
    title: data.title,
    body: data.body,
    comment: data.body,
    pros: data.pros || [],
    cons: data.cons || [],
    images: (data.images || []).map((image) => ({
      url: image.url,
      publicId: image.publicId,
    })),
    image: data.images?.[0]?.url || "",
    isVerifiedPurchase: Boolean(data.isVerifiedPurchase),
    isVerified: Boolean(data.isVerifiedPurchase),
    helpfulVotes: {
      up: data.helpfulVotes?.up || 0,
      down: data.helpfulVotes?.down || 0,
    },
    viewerVote: data.viewerVote || null,
    isApproved: Boolean(data.isApproved),
    status: data.status,
    reportCount: data.reportCount || 0,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

const buildSummary = (reviews) => {
  const totalReviews = reviews.length;
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  let totalRating = 0;
  for (const review of reviews) {
    counts[review.rating] += 1;
    totalRating += review.rating;
  }

  const averageRating = totalReviews
    ? Number((totalRating / totalReviews).toFixed(1))
    : 0;

  return {
    averageRating,
    totalReviews,
    ratingBreakdown: [5, 4, 3, 2, 1].map((rating) => {
      const count = counts[rating];
      return {
        rating,
        count,
        percentage: totalReviews
          ? Math.round((count / totalReviews) * 100)
          : 0,
      };
    }),
  };
};

const updateProductRatingStats = async (productId) => {
  const stats = await Review.aggregate([
    {
      $match: {
        productId: toObjectId(productId),
        status: "approved",
        isApproved: true,
        isHidden: false,
      },
    },
    {
      $group: {
        _id: "$productId",
        averageRating: { $avg: "$rating" },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  const result = stats[0];

  await Product.findByIdAndUpdate(productId, {
    averageRating: result ? Number(result.averageRating.toFixed(1)) : 0,
    numReviews: result ? result.numReviews : 0,
  });
};

const hasVerifiedPurchase = async (userId, productId) => {
  const matchingOrder = await Order.findOne({
    user: userId,
    orderStatus: { $in: ["Placed", "Shipped", "Delivered"] },
    "items.product": productId,
  }).lean();

  return Boolean(matchingOrder);
};

const uploadImagesToCloudinary = async (files) => {
  const uploads = await Promise.all(
    files.map((file, index) =>
      uploadBufferToCloudinary(file.buffer, {
        folder: REVIEW_IMAGE_FOLDER,
        resource_type: "image",
        public_id: `review-${Date.now()}-${index}`,
      }),
    ),
  );

  return uploads.map((image) => ({
    url: image.secure_url,
    publicId: image.public_id,
  }));
};

const parsePagination = (query) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, Number(query.limit) || DEFAULT_PAGE_SIZE),
  );
  return { page, limit };
};

const getViewerVote = (review, userId) => {
  if (!userId) return null;
  const existingVote = review.votedBy.find(
    (entry) => String(entry.userId) === String(userId),
  );
  return existingVote ? existingVote.vote : null;
};

exports.uploadReviewImages = async (req, res) => {
  try {
    const files = req.files || [];
    if (!files.length) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one review image.",
      });
    }

    const images = await uploadImagesToCloudinary(files);

    return res.status(201).json({
      success: true,
      data: images,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to upload review images.",
      error: error.message,
    });
  }
};

exports.createReview = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { productId, rating, title, body } = req.body;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Please log in to submit a review." });
    }

    if (!productId || !rating || !title || !body) {
      return res.status(400).json({
        success: false,
        message: "Product, rating, title, and review body are required.",
      });
    }

    const product = await Product.findById(productId).select("_id");
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }

    const existingReview = await Review.findOne({ productId, userId });
    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this product.",
      });
    }

    const [verifiedPurchase, uploadedImages] = await Promise.all([
      hasVerifiedPurchase(userId, productId),
      req.files?.length
        ? uploadImagesToCloudinary(req.files)
        : Promise.resolve([]),
    ]);

    const imagesFromBody = parseImagesPayload(req.body.images);
    const finalImages = uploadedImages.length ? uploadedImages : imagesFromBody;

    const review = await Review.create({
      productId,
      userId,
      userName: req.user.name,
      rating: Number(rating),
      title: String(title).trim(),
      body: String(body).trim(),
      pros: normalizeList(req.body.pros),
      cons: normalizeList(req.body.cons),
      images: finalImages,
      isVerifiedPurchase: verifiedPurchase,
      isApproved: false,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: verifiedPurchase
        ? "Review submitted and queued for approval. Verified purchase detected."
        : "Review submitted and queued for approval.",
      data: serializeReview(review),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this product.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to submit review.",
      error: error.message,
    });
  }
};

exports.getReviewEligibility = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { productId } = req.params;

    const [verifiedPurchase, existingReview] = await Promise.all([
      hasVerifiedPurchase(userId, productId),
      Review.findOne({ productId, userId }).select("_id status").lean(),
    ]);

    return res.json({
      success: true,
      data: {
        hasVerifiedPurchase: verifiedPurchase,
        hasReviewed: Boolean(existingReview),
        reviewStatus: existingReview?.status || null,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to load review eligibility.",
      error: error.message,
    });
  }
};

exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({
      productId,
      status: "approved",
      isApproved: true,
      isHidden: false,
    })
      .populate("userId", "name")
      .populate("productId", "name images")
      .sort({ createdAt: -1 });

    const serializedReviews = reviews.map((review) => ({
      ...serializeReview(review),
      viewerVote: getViewerVote(review, req.user?.id),
    }));

    return res.json({
      success: true,
      data: {
        reviews: serializedReviews,
        summary: buildSummary(serializedReviews),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews.",
      error: error.message,
    });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const { page, limit } = parsePagination(req.query);
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find({
        status: "approved",
        isApproved: true,
        isHidden: false,
      })
        .populate("userId", "name")
        .populate("productId", "name images")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Review.countDocuments({
        status: "approved",
        isApproved: true,
        isHidden: false,
      }),
    ]);

    return res.json({
      success: true,
      data: reviews.map(serializeReview),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews.",
      error: error.message,
    });
  }
};

exports.voteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { vote } = req.body;
    const userId = req.user?.id;

    if (!["up", "down"].includes(vote)) {
      return res
        .status(400)
        .json({ success: false, message: "Vote must be 'up' or 'down'." });
    }

    const review = await Review.findById(reviewId);
    if (!review || review.status !== "approved" || !review.isApproved || review.isHidden) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found." });
    }

    const existingVoteIndex = review.votedBy.findIndex(
      (entry) => String(entry.userId) === String(userId),
    );

    if (existingVoteIndex >= 0) {
      const previousVote = review.votedBy[existingVoteIndex].vote;
      if (previousVote === vote) {
        review.votedBy.splice(existingVoteIndex, 1);
        review.helpfulVotes[vote] = Math.max(0, review.helpfulVotes[vote] - 1);
      } else {
        review.votedBy[existingVoteIndex].vote = vote;
        review.helpfulVotes[previousVote] = Math.max(
          0,
          review.helpfulVotes[previousVote] - 1,
        );
        review.helpfulVotes[vote] += 1;
      }
    } else {
      review.votedBy.push({ userId, vote });
      review.helpfulVotes[vote] += 1;
    }

    await review.save();

    return res.json({
      success: true,
      message: "Thanks for your feedback.",
      data: {
        helpfulVotes: review.helpfulVotes,
        viewerVote: getViewerVote(review, userId),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to record vote.",
      error: error.message,
    });
  }
};

exports.reportReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user?.id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found." });
    }

    const alreadyReported = review.reportedBy.some(
      (entry) => String(entry) === String(userId),
    );

    if (alreadyReported) {
      return res.status(409).json({
        success: false,
        message: "You have already reported this review.",
      });
    }

    review.reportedBy.push(userId);
    review.reportCount += 1;
    await review.save();

    return res.json({
      success: true,
      message: "Review reported. Our team will take a look.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to report review.",
      error: error.message,
    });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found." });
    }

    const isOwner = String(review.userId) === String(req.user?.id);
    const isAdmin = req.role === "admin" || req.user?.role === "admin";

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ success: false, message: "You cannot delete this review." });
    }

    await Promise.all(
      review.images.map((image) => destroyCloudinaryAsset(image.publicId)),
    );
    await Review.findByIdAndDelete(reviewId);
    await updateProductRatingStats(review.productId);

    return res.json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete review.",
      error: error.message,
    });
  }
};

exports.getAdminReviews = async (req, res) => {
  try {
    const { page, limit } = parsePagination(req.query);
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find({})
        .populate("userId", "name email")
        .populate("productId", "name images")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Review.countDocuments({}),
    ]);

    return res.json({
      success: true,
      data: reviews.map(serializeReview),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin reviews.",
      error: error.message,
    });
  }
};

exports.updateReviewStatus = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { status } = req.body || {};

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid review status." });
    }

    const review = await Review.findByIdAndUpdate(
      reviewId,
      {
        status,
        isApproved: status === "approved",
        isHidden: status === "rejected",
      },
      { new: true },
    );

    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found." });
    }

    await updateProductRatingStats(review.productId);

    return res.json({
      success: true,
      message: `Review ${status}.`,
      data: serializeReview(review),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update review status.",
      error: error.message,
    });
  }
};

exports.approveReview = async (req, res) => {
  req.body = {
    ...(req.body || {}),
    status: "approved",
  };
  return exports.updateReviewStatus(req, res);
};

exports.submitReview = async (req, res) => {
  try {
    const { token, rating, title, body, comment, pros, cons } = req.body;

    if (!token || !rating || !(body || comment)) {
      return res.status(400).json({
        success: false,
        message: "Token, rating, and review body are required.",
      });
    }

    const order = await Order.findOne({ reviewToken: token })
      .populate("items.product")
      .populate("user", "name");

    if (!order) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired review token.",
      });
    }

    const createdReviews = [];

    for (const item of order.items) {
      const productId = item.product?._id || item.product;
      const existingReview = await Review.findOne({
        productId,
        userId: order.user._id || order.user,
      });

      if (existingReview) {
        continue;
      }

      const review = await Review.create({
        productId,
        userId: order.user._id || order.user,
        userName: order.user.name,
        rating: Number(rating),
        title: String(title || "Order review").trim(),
        body: String(body || comment).trim(),
        pros: normalizeList(pros),
        cons: normalizeList(cons),
        isVerifiedPurchase: true,
        isApproved: false,
        status: "pending",
      });

      createdReviews.push(serializeReview(review));
    }

    order.reviewToken = undefined;
    await order.save();

    return res.json({
      success: true,
      message: "Review submitted successfully.",
      data: createdReviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to submit token-based review.",
      error: error.message,
    });
  }
};

exports.hideReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      {
        isHidden: true,
        status: "rejected",
        isApproved: false,
      },
      { new: true },
    );

    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found." });
    }

    await updateProductRatingStats(review.productId);

    return res.json({
      success: true,
      message: "Review hidden successfully.",
      data: serializeReview(review),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to hide review.",
      error: error.message,
    });
  }
};

exports.unhideReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      {
        isHidden: false,
        status: "approved",
        isApproved: true,
      },
      { new: true },
    );

    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found." });
    }

    await updateProductRatingStats(review.productId);

    return res.json({
      success: true,
      message: "Review unhidden successfully.",
      data: serializeReview(review),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to unhide review.",
      error: error.message,
    });
  }
};
