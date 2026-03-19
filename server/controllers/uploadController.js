const { cloudinary } = require("../config/cloudinary");

// @desc    Upload image to Cloudinary
// @route   POST /api/upload
// @access  Public
exports.uploadImage = async (req, res) => {
  try {
    console.log("Upload request received:", req.file);
    console.log("Request body:", req.body);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // If using Cloudinary
    if (cloudinary && process.env.CLOUDINARY_CLOUD_NAME) {
      // File is already uploaded by multer-storage-cloudinary
      const imageUrl = req.file.path;
      console.log("Cloudinary upload successful:", imageUrl);

      res.json({
        success: true,
        url: imageUrl,
        message: "Image uploaded successfully",
      });
    } else {
      // Fallback for local storage
      const imageUrl = `/uploads/${req.file.filename}`;
      console.log("Local upload successful:", imageUrl);

      res.json({
        success: true,
        url: imageUrl,
        message: "Image uploaded successfully",
      });
    }
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Upload failed",
    });
  }
};
