const Offer = require('../models/Offer');

// @desc    Create new offer
// @route   POST /api/admin/offers
// @access  Private/Admin
const createOffer = async (req, res) => {
  try {
    const offer = await Offer.create(req.body);
    res.status(201).json({ success: true, data: offer });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all offers for Admin
// @route   GET /api/admin/offers
// @access  Private/Admin
const getAdminOffers = async (req, res) => {
  try {
    const offers = await Offer.find().sort({ priority: -1, createdAt: -1 });
    res.status(200).json({ success: true, data: offers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single offer
// @route   GET /api/admin/offers/:id
// @access  Private/Admin
const getOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }
    res.status(200).json({ success: true, data: offer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update offer
// @route   PUT /api/admin/offers/:id
// @access  Private/Admin
const updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }
    res.status(200).json({ success: true, data: offer });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete offer
// @route   DELETE /api/admin/offers/:id
// @access  Private/Admin
const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle offer active status
// @route   PATCH /api/admin/offers/:id/toggle-active
// @access  Private/Admin
const toggleOfferActive = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }
    offer.isActive = !offer.isActive;
    await offer.save();
    res.status(200).json({ success: true, data: offer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get active public offers
// @route   GET /api/offers/active
// @access  Public
const getPublicOffers = async (req, res) => {
  try {
    const { placement } = req.query;
    
    let query = {
      isActive: true,
      $or: [
        { validTill: { $exists: false } },
        { validTill: { $gte: new Date() } },
      ]
    };

    if (placement === 'cart') {
      query.showOnCart = true;
    } else if (placement === 'checkout') {
      query.showOnCheckout = true;
    }

    const offers = await Offer.find(query)
      .populate('linkedCouponId', 'code discountType discountValue minOrderAmount validTill isActive')
      .sort({ priority: -1, createdAt: -1 });

    // Merge linked coupon code into offer for convenience
    const enriched = offers.map((offer) => {
      const plain = offer.toObject();
      // If this offer is linked to a coupon and the coupon is active, expose the code
      if (plain.linkedCouponId && plain.linkedCouponId.isActive) {
        plain.code = plain.code || plain.linkedCouponId.code;
        plain.linkedCouponCode = plain.linkedCouponId.code;
      }
      return plain;
    });
      
    res.status(200).json({ success: true, data: enriched });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOffer,
  getAdminOffers,
  getOffer,
  updateOffer,
  deleteOffer,
  toggleOfferActive,
  getPublicOffers,
};
