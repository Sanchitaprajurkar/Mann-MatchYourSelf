const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // Don't include password in queries by default
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    // Optional profile fields
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer_not_to_say"],
    },
    dateOfBirth: {
      type: Date,
    },
    mobileNumber: {
      type: String,
      match: [/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"],
    },
    // Cart and Wishlist for e-commerce functionality
    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
        size: {
          type: String,
        },
        color: {
          type: String,
        },
      },
    ],
    wishlist: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Addresses for e-commerce functionality
    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  },
);

// Password hashing middleware - temporarily disabled
// userSchema.pre("save", function (next) {
//   const user = this;

//   // Only hash the password if it has been modified (or is new)
//   if (!user.isModified("password")) {
//     return next();
//   }

//   // Hash password with cost of 12
//   bcrypt.genSalt(12, function(err, salt) {
//     if (err) {
//       return next(err);
//     }
//     bcrypt.hash(user.password, salt, function(err, hash) {
//       if (err) {
//         return next(err);
//       }
//       user.password = hash;
//       next();
//     });
//   });
// });

// Create and export User model
const User = mongoose.model("User", userSchema);

module.exports = User;
