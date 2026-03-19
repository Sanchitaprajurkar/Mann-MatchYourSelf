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
    } = req.body;

    // Validation
    if (!name || !mobile || !pincode || !addressLine) {
      return res.status(400).json({
        success: false,
        message:
          "Mandatory fields are missing: name, mobile, pincode, addressLine",
      });
    }

    // Handle default address logic in controller
    if (isDefault) {
      await Address.updateMany(
        { user: req.user.id, _id: { $ne: null } },
        { isDefault: false },
      );
    }

    // Create address
    const newAddress = new Address({
      user: req.user.id,
      name,
      mobile,
      pincode,
      state,
      house: house || houseNumber,
      addressLine: addressLine || address,
      locality,
      city,
      addressType: addressType || type || "HOME",
      isDefault: isDefault || false,
    });

    const savedAddress = await newAddress.save();

    // Link to user
    try {
      const User = require("../models/User");
      await User.findByIdAndUpdate(req.user.id, {
        $push: { addresses: savedAddress._id },
      });
    } catch (userUpdateError) {
      // User model may not have addresses array - continue
    }

    res.status(201).json({
      success: true,
      message: "Address created successfully",
      data: savedAddress,
    });
  } catch (error) {
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
