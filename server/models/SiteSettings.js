const mongoose = require("mongoose");

const siteSettingsSchema = new mongoose.Schema(
  {
    heroVideo: {
      type: String,
      default: "",
    },
    heroVideoPoster: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteSettings", siteSettingsSchema);
