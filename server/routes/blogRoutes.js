const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const { protect, admin } = require("../middleware/authMiddleware");
// Since previous step showed adminMiddleware is separate file and authMiddleware exports protect separately
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../middleware/upload");

// Public
router.get("/", blogController.getPublishedBlogs);
router.get("/:slug", blogController.getBlogBySlug);

// Admin
router.get("/admin/all", protect, adminMiddleware, blogController.getAllBlogsAdmin);
router.post("/", protect, adminMiddleware, upload.single("image"), blogController.createBlog);
router.put("/:id", protect, adminMiddleware, upload.single("image"), blogController.updateBlog);
router.delete("/:id", protect, adminMiddleware, blogController.deleteBlog);

module.exports = router;
