const SiteSettings = require("../models/SiteSettings");
const cloudinary = require("../config/cloudinary");

// Upload or update hero video
exports.uploadHeroVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No video file provided",
      });
    }

    const videoUrl = req.file.path;
    const videoPublicId = req.file.filename;

    console.log("📹 Video uploaded to Cloudinary:", videoUrl);

    // Find existing settings or create new
    let settings = await SiteSettings.findOne();

    if (!settings) {
      settings = new SiteSettings({
        heroVideo: videoUrl,
      });
    } else {
      // Delete old video from Cloudinary if exists
      if (settings.heroVideo) {
        try {
          const oldPublicId = settings.heroVideo
            .split("/")
            .slice(-2)
            .join("/")
            .split(".")[0];
          await cloudinary.uploader.destroy(oldPublicId, {
            resource_type: "video",
          });
          console.log("🗑️ Old video deleted from Cloudinary");
        } catch (error) {
          console.log("⚠️ Could not delete old video:", error.message);
        }
      }

      settings.heroVideo = videoUrl;
    }

    await settings.save();

    res.json({
      success: true,
      message: "Hero video uploaded successfully",
      heroVideo: videoUrl,
    });
  } catch (error) {
    console.error("❌ Upload hero video error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload video",
      error: error.message,
    });
  }
};

// Get hero video
exports.getHeroVideo = async (req, res) => {
  try {
    const settings = await SiteSettings.findOne();

    if (!settings || !settings.heroVideo) {
      return res.json({
        success: true,
        heroVideo: null,
      });
    }

    res.json({
      success: true,
      heroVideo: settings.heroVideo,
    });
  } catch (error) {
    console.error("❌ Get hero video error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch video",
      error: error.message,
    });
  }
};

// Delete hero video
exports.deleteHeroVideo = async (req, res) => {
  try {
    const settings = await SiteSettings.findOne();

    if (!settings || !settings.heroVideo) {
      return res.status(404).json({
        success: false,
        message: "No hero video found",
      });
    }

    // Delete from Cloudinary
    try {
      const publicId = settings.heroVideo
        .split("/")
        .slice(-2)
        .join("/")
        .split(".")[0];
      await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
      console.log("🗑️ Video deleted from Cloudinary");
    } catch (error) {
      console.log("⚠️ Could not delete video from Cloudinary:", error.message);
    }

    settings.heroVideo = "";
    await settings.save();

    res.json({
      success: true,
      message: "Hero video deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete hero video error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete video",
      error: error.message,
    });
  }
};
