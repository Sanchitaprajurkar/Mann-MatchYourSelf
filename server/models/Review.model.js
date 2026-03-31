const mongoose = require("mongoose");

const reviewImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false },
);

const voteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vote: {
      type: String,
      enum: ["up", "down"],
      required: true,
    },
  },
  { _id: false },
);

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 4000,
    },
    pros: {
      type: [String],
      default: [],
    },
    cons: {
      type: [String],
      default: [],
    },
    images: {
      type: [reviewImageSchema],
      default: [],
      validate: {
        validator: (images) => images.length <= 5,
        message: "A review can include up to 5 images.",
      },
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    helpfulVotes: {
      up: { type: Number, default: 0 },
      down: { type: Number, default: 0 },
    },
    votedBy: {
      type: [voteSchema],
      default: [],
    },
    isApproved: {
      type: Boolean,
      default: false,
      index: true,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    reportCount: {
      type: Number,
      default: 0,
    },
    reportedBy: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });
reviewSchema.index({ productId: 1, createdAt: -1 });

reviewSchema.virtual("name").get(function getName() {
  return this.userName;
});

reviewSchema.virtual("comment").get(function getComment() {
  return this.body;
});

reviewSchema.virtual("isVerified").get(function getIsVerified() {
  return this.isVerifiedPurchase;
});

reviewSchema.virtual("image").get(function getImage() {
  return this.images?.[0]?.url || "";
});

module.exports = mongoose.model("Review", reviewSchema);
