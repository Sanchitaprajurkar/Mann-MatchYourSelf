const Address = require("../models/Address");

// Get all addresses for the authenticated user
const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: addresses,
      count: addresses.length,
    });
  } catch (error) {
    console.error("❌ FETCH ADDRESSES ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch addresses",
      error: error.message,
    });
  }
};

// Get a single address by ID
const getAddressById = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await Address.findOne({ _id: id, user: req.user.id });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      data: address,
    });
  } catch (error) {
    console.error("❌ GET ADDRESS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch address",
      error: error.message,
    });
  }
};

// Create a new address
const createAddress = async (req, res) => {
  try {
    console.log("📍 CREATE ADDRESS REQUEST");
    console.log("📍 User ID:", req.user.id);
    console.log("📍 Request Body:", JSON.stringify(req.body, null, 2));

    const {
      name,
      mobile,
      pincode,
      state,
      house,
      houseNumber,
      addressLine,
      address,
      locality,
      city,
      addressType,
      type,
      isDefault,
      openSaturday,
      openSunday,
    } = req.body;

    // Detailed validation with specific error messages
    const validationErrors = [];

    if (!name || !name.trim()) {
      validationErrors.push({ field: 'name', message: 'Full name is required' });
    }

    if (!mobile || !mobile.trim()) {
      validationErrors.push({ field: 'mobile', message: 'Mobile number is required' });
    } else {
      // Normalize and validate mobile
      const normalizedMobile = mobile.trim().replace(/\s+/g, '');
      if (!/^\+91\d{10}$/.test(normalizedMobile)) {
        validationErrors.push({ 
          field: 'mobile', 
          message: 'Mobile number must be in format +919876543210 (10 digits after +91)' 
        });
      }
    }

    if (!pincode || !pincode.trim()) {
      validationErrors.push({ field: 'pincode', message: 'Pincode is required' });
    } else {
      const normalizedPincode = pincode.trim().replace(/\D/g, '');
      if (normalizedPincode.length !== 6) {
        validationErrors.push({ 
          field: 'pincode', 
          message: 'Pincode must be exactly 6 digits' 
        });
      }
    }

    const finalAddressLine = addressLine || address;
    if (!finalAddressLine || !finalAddressLine.trim()) {
      validationErrors.push({ field: 'addressLine', message: 'Street address is required' });
    }

    if (!state || !state.trim()) {
      validationErrors.push({ field: 'state', message: 'State is required' });
    }

    const finalHouse = house || houseNumber;
    if (!finalHouse || !finalHouse.trim()) {
      validationErrors.push({ field: 'house', message: 'House/Flat/Block number is required' });
    }

    if (!locality || !locality.trim()) {
      validationErrors.push({ field: 'locality', message: 'Locality is required' });
    }

    if (!city || !city.trim()) {
      validationErrors.push({ field: 'city', message: 'City is required' });
    }

    const finalAddressType = addressType || type || 'HOME';
    if (!['HOME', 'OFFICE'].includes(finalAddressType)) {
      validationErrors.push({ 
        field: 'addressType', 
        message: 'Address type must be HOME or OFFICE' 
      });
    }

    // Return validation errors if any
    if (validationErrors.length > 0) {
      console.log("❌ VALIDATION ERRORS:", validationErrors);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    // Handle default address logic in controller
    if (isDefault) {
      await Address.updateMany(
        { user: req.user.id, _id: { $ne: null } },
        { isDefault: false },
      );
    }

    // Normalize data before saving
    const normalizedMobile = mobile.trim().replace(/\s+/g, '');
    const normalizedPincode = pincode.trim().replace(/\D/g, '');

    // Create address
    const newAddress = new Address({
      user: req.user.id,
      name: name.trim(),
      mobile: normalizedMobile,
      pincode: normalizedPincode,
      state: state.trim(),
      house: (house || houseNumber).trim(),
      addressLine: (addressLine || address).trim(),
      locality: locality.trim(),
      city: city.trim(),
      addressType: finalAddressType,
      openSaturday: openSaturday || false,
      openSunday: openSunday || false,
      isDefault: isDefault || false,
    });

    const savedAddress = await newAddress.save();
    console.log("✅ ADDRESS CREATED:", savedAddress._id);

    // Link to user
    try {
      const User = require("../models/User");
      await User.findByIdAndUpdate(req.user.id, {
        $push: { addresses: savedAddress._id },
      });
    } catch (userUpdateError) {
      // User model may not have addresses array - continue
      console.log("⚠️ Could not link address to user:", userUpdateError.message);
    }

    res.status(201).json({
      success: true,
      message: "Address created successfully",
      data: savedAddress,
    });
  } catch (error) {
    console.error("❌ CREATE ADDRESS ERROR:", error);

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Update an existing address
const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log("📍 UPDATE ADDRESS HIT");
    console.log("📍 ADDRESS ID:", id);
    console.log("📍 USER ID:", req.user.id);
    console.log("📍 UPDATE DATA:", updateData);

    const address = await Address.findOneAndUpdate(
      { _id: id, user: req.user.id },
      updateData,
      { new: true, runValidators: true },
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    console.log("📍 ADDRESS UPDATED:", address._id);

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: address,
    });
  } catch (error) {
    console.error("❌ UPDATE ADDRESS ERROR:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: Object.values(error.errors)
          .map((err) => err.message)
          .join(", "),
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update address",
      error: error.message,
    });
  }
};

// Delete an address
const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("📍 DELETE ADDRESS HIT");
    console.log("📍 ADDRESS ID:", id);
    console.log("📍 USER ID:", req.user.id);

    const address = await Address.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    console.log("📍 ADDRESS DELETED:", address._id);

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("❌ DELETE ADDRESS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete address",
      error: error.message,
    });
  }
};

// Set an address as default
const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await Address.findOne({ _id: id, user: req.user.id });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // Handle default address logic in controller
    await Address.updateMany(
      { user: req.user.id, _id: { $ne: id } },
      { isDefault: false },
    );

    // Set this address as default
    address.isDefault = true;
    await address.save();

    res.status(200).json({
      success: true,
      message: "Default address updated successfully",
      data: address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to set default address",
      error: error.message,
    });
  }
};

// Get the default address for the user
const getDefaultAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      user: req.user.id,
      isDefault: true,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "No default address found",
      });
    }

    res.status(200).json({
      success: true,
      data: address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch default address",
      error: error.message,
    });
  }
};

module.exports = {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getDefaultAddress,
};
