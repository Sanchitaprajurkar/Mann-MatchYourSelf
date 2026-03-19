const express = require("express");
const router = express.Router();
const multer = require("multer");
const { cloudinary } = require("../config/cloudinary");
const { uploadImage } = require("../controllers/uploadController");

// Dynamic upload middleware that handles folder parameter
const getUploadMiddleware = (req, res, next) => {
  const folder = req.body.folder || "mann-uploads";

  if (cloudinary && process.env.CLOUDINARY_CLOUD_NAME) {
    // Use Cloudinary storage with dynamic folder
    const { CloudinaryStorage } = require("multer-storage-cloudinary");
    const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: folder,
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        public_id: (req, file) => {
          const timestamp = Date.now();
          const originalName = file.originalname.split(".")[0];
          return `${originalName}-${timestamp}`;
        },
      },
    });

    const upload = multer({
      storage: storage,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
      fileFilter: (req, file, cb) => {
        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
        ];
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new Error(
              "Invalid file type. Only JPEG, PNG, and WebP are allowed.",
            ),
            false,
          );
        }
      },
    });

    upload.single("image")(req, res, next);
  } else {
    // Fallback to local storage
    const path = require("path");
    const fs = require("fs");
    const uploadsDir = path.join(__dirname, "../uploads");

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadsDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
          null,
          file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
        );
      },
    });

    const upload = multer({
      storage: storage,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
      fileFilter: (req, file, cb) => {
        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
        ];
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new Error(
              "Invalid file type. Only JPEG, PNG, and WebP are allowed.",
            ),
            false,
          );
        }
      },
    });

    upload.single("image")(req, res, next);
  }
};

// Upload route with dynamic middleware
router.post("/", getUploadMiddleware, uploadImage);

module.exports = router;
