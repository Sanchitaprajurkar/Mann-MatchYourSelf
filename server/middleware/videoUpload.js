const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "mann/videos",
    resource_type: "video",
    allowed_formats: ["mp4", "mov", "webm", "avi"],
    transformation: [{ quality: "auto" }],
  },
});

const uploadVideo = multer({
  storage: videoStorage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("video/")) {
      return cb(new Error("Only video files are allowed!"), false);
    }
    cb(null, true);
  },
});

module.exports = uploadVideo;
