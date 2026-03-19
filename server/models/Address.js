const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
      match: [/^\+91\s?\d{10}$/, "Please enter a valid Indian mobile number"],
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{6}$/, "Please enter a valid 6-digit pincode"],
    },
    state: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    house: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    addressLine: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    locality: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    addressType: {
      type: String,
      enum: ["HOME", "OFFICE"],
      required: true,
      default: "HOME",
    },
    openSaturday: {
      type: Boolean,
      default: false,
    },
    openSunday: {
      type: Boolean,
      default: false,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for performance
addressSchema.index({ user: 1, isDefault: 1 });
addressSchema.index({ user: 1, createdAt: -1 });

// Virtual for formatted address
addressSchema.virtual("formattedAddress").get(function () {
  const parts = [
    this.house,
    this.addressLine,
    this.locality,
    this.city,
    this.state,
    this.pincode,
  ].filter(Boolean);
  return parts.join(", ");
});

// Static method to get default address for a user
addressSchema.statics.getDefaultAddress = function (userId) {
  return this.findOne({ user: userId, isDefault: true });
};

// Static method to set default address (controller-friendly)
addressSchema.statics.setAsDefault = async function (addressId, userId) {
  // Unset all other default addresses for this user
  await this.updateMany(
    { user: userId, _id: { $ne: addressId } },
    { isDefault: false }
  );
  
  // Set this address as default
  return this.findByIdAndUpdate(
    addressId,
    { isDefault: true },
    { new: true }
  );
};

// Method to get full address object for orders
addressSchema.methods.getOrderAddress = function () {
  return {
    fullName: this.name,
    phone: this.mobile,
    address: this.formattedAddress,
    city: this.city,
    state: this.state,
    pincode: this.pincode,
  };
};

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
