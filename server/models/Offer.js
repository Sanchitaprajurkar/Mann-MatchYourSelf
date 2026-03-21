const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an offer title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide an offer description'],
  },
  code: {
    type: String,
    uppercase: true,
    trim: true,
  },
  // Link this display offer to a real Coupon document
  linkedCouponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
  },
  linkedCouponCode: {
    type: String,
    uppercase: true,
    trim: true,
  },
  offerCategory: {
    type: String,
    enum: ['coupon_offer', 'bank_offer', 'shipping_offer', 'info'],
    default: 'info',
  },
  offerType: {
    type: String,
    enum: ['percentage', 'flat', 'free_shipping', 'bank_offer', 'info'],
    default: 'info',
  },
  discountValue: {
    type: Number,
    default: 0,
  },
  minOrderAmount: {
    type: Number,
    default: 0,
  },
  bankName: {
    type: String,
    trim: true,
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
  showOnCart: {
    type: Boolean,
    default: true,
  },
  showOnCheckout: {
    type: Boolean,
    default: true,
  },
  priority: {
    type: Number,
    default: 0,
  },
  usageLimit: {
    type: Number,
  },
  usedCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema);
