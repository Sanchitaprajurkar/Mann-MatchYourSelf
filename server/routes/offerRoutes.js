const express = require('express');
const router = express.Router();
const {
  createOffer,
  getAdminOffers,
  getOffer,
  updateOffer,
  deleteOffer,
  toggleOfferActive,
  getPublicOffers,
} = require('../controllers/offerController');
const { protect } = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminOnlyMiddleware');

// Public routes
router.get('/active', getPublicOffers);

// Admin routes
router.post('/admin', protect, adminOnly, createOffer);
router.get('/admin', protect, adminOnly, getAdminOffers);
router.get('/admin/:id', protect, adminOnly, getOffer);
router.put('/admin/:id', protect, adminOnly, updateOffer);
router.delete('/admin/:id', protect, adminOnly, deleteOffer);
router.patch('/admin/:id/toggle-active', protect, adminOnly, toggleOfferActive);

module.exports = router;
