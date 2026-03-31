const multer = require("multer");

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(new Error("Only JPEG, PNG, and WEBP images are allowed."));
    return;
  }

  cb(null, true);
};

const reviewImageUpload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 5,
  },
  fileFilter,
});

module.exports = {
  reviewImageUpload,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
};
