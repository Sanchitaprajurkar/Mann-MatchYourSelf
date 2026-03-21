const express = require('express');
const router = express.Router();
const {
  createCoupon,
  getAdminCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCouponActive,
  applyCoupon,
} = require('../controllers/couponController');
const { protect } = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminOnlyMiddleware');

// Public route
router.post('/apply', applyCoupon);

// Admin routes
router.post('/admin', protect, adminOnly, createCoupon);
router.get('/admin', protect, adminOnly, getAdminCoupons);
router.get('/admin/:id', protect, adminOnly, getCoupon);
router.put('/admin/:id', protect, adminOnly, updateCoupon);
router.delete('/admin/:id', protect, adminOnly, deleteCoupon);
router.patch('/admin/:id/toggle-active', protect, adminOnly, toggleCouponActive);

module.exports = router;
