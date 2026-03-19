const mongoose = require("mongoose");

const heroSlideSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    title: String,
    subtitle: String,
    cta: String,
    link: String,
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HeroSlide", heroSlideSchema);
