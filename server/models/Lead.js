const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    email: String,
    phone: String,
    preference: {
      type: String,
      enum: ["EMAIL", "WHATSAPP", "BOTH"],
      required: true,
    },
    source: {
      type: String,
      default: "FOOTER",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Lead", leadSchema);
