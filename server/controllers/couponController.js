const Coupon = require('../models/Coupon');
const Order = require('../models/Order'); // Assuming an Order model exists

// @desc    Create new coupon
// @route   POST /api/admin/coupons
// @access  Private/Admin
const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, data: coupon });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Coupon code already exists' });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all coupons for Admin
// @route   GET /api/admin/coupons
// @access  Private/Admin
const getAdminCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single coupon
// @route   GET /api/admin/coupons/:id
// @access  Private/Admin
const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
      .populate('applicableCategories', 'name')
      .populate('applicableProducts', 'name');

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }
    res.status(200).json({ success: true, data: coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update coupon
// @route   PUT /api/admin/coupons/:id
// @access  Private/Admin
const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }
    res.status(200).json({ success: true, data: coupon });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Coupon code already exists' });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete coupon
// @route   DELETE /api/admin/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle coupon active status
// @route   PATCH /api/admin/coupons/:id/toggle-active
// @access  Private/Admin
const toggleCouponActive = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    res.status(200).json({ success: true, data: coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Apply coupon
// @route   POST /api/coupons/apply
// @access  Public
const applyCoupon = async (req, res) => {
  try {
    const { code, cartItems, cartTotal, userId } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Please provide a coupon code' });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    // 1. Validate Existance
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    // 2. Validate Active Status
    if (!coupon.isActive) {
      return res.status(400).json({ success: false, message: 'Coupon is inactive' });
    }

    // 3. Validate Dates
    const now = new Date();
    if (coupon.validFrom && new Date(coupon.validFrom) > now) {
      return res.status(400).json({ success: false, message: 'Coupon is not valid yet' });
    }
    if (coupon.validTill && new Date(coupon.validTill) < now) {
      return res.status(400).json({ success: false, message: 'Coupon has expired' });
    }

    // 4. Validate Min Order Amount
    if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum cart value of ₹${coupon.minOrderAmount} not met`,
      });
    }

    // 5. Validate Total Usage Limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
    }

    // 6. Validate Per-User Limit (if user is passed)
    if (userId && coupon.userUsageLimit) {
      try {
        const orderCount = await Order.countDocuments({ 
          user: userId, 
          'appliedCoupon.code': coupon.code 
        });
        if (orderCount >= coupon.userUsageLimit) {
          return res.status(400).json({ 
            success: false, 
            message: 'You have reached the usage limit for this coupon' 
          });
        }
      } catch (err) {
        // Ignore if Order checking fails
      }
    }

    // 7. Validate Applicable Categories / Products
    let eligibleTotal = cartTotal;

    if (
      (coupon.applicableCategories && coupon.applicableCategories.length > 0) ||
      (coupon.applicableProducts && coupon.applicableProducts.length > 0)
    ) {
      let isApplicable = false;
      eligibleTotal = 0;

      cartItems.forEach((item) => {
        const matchesProduct = coupon.applicableProducts.includes(item.productId || item._id);
        const matchesCategory = coupon.applicableCategories.includes(item.categoryId); // Requires frontend to pass categoryId if supported
        
        if (matchesProduct || matchesCategory) {
          isApplicable = true;
          eligibleTotal += (item.price * item.quantity);
        }
      });

      if (!isApplicable) {
        return res.status(400).json({
          success: false,
          message: 'Coupon not applicable to any products in your cart',
        });
      }
    }

    // 8. Calculate Discount
    let discountAmount = 0;

    if (coupon.discountType === 'percentage') {
      discountAmount = (eligibleTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else if (coupon.discountType === 'flat') {
      discountAmount = coupon.discountValue;
    } else if (coupon.discountType === 'free_shipping') {
      discountAmount = 0; // Handled separately by frontend/backend shipping calc logic, but we can set 50 or similar
    }

    // Final total validation check
    discountAmount = Math.min(discountAmount, cartTotal);
    const newTotal = cartTotal - discountAmount;

    res.status(200).json({
      success: true,
      message: 'Coupon applied successfully',
      data: {
        coupon: {
          _id: coupon._id,
          code: coupon.code,
          title: coupon.title,
        },
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        newTotal,
      },
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createCoupon,
  getAdminCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCouponActive,
  applyCoupon,
};
