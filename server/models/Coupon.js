const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please provide a coupon code'],
    uppercase: true,
    trim: true,
    unique: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a coupon title'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  discountType: {
    type: String,
    enum: ['percentage', 'flat', 'free_shipping'],
    required: [true, 'Please provide a discount type'],
  },
  discountValue: {
    type: Number,
    required: [true, 'Please provide a discount value'],
  },
  minOrderAmount: {
    type: Number,
    default: 0,
  },
  maxDiscountAmount: {
    type: Number,
  },
  validFrom: {
    type: Date,
  },
  validTill: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  usageLimit: {
    type: Number,
  },
  usedCount: {
    type: Number,
    default: 0,
  },
  userUsageLimit: {
    type: Number,
    default: 1,
  },
  applicableCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  }],
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
