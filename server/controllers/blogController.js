const Blog = require("../models/Blog");

// Get all published blogs (public)
exports.getPublishedBlogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const blogs = await Blog.find({ status: "published" })
      .sort({ createdAt: -1 })
      .limit(limit);
    
    res.json({ success: true, data: blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get single blog by slug (public)
exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, status: "published" });
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json({ success: true, data: blog });
  } catch (error) {
     console.error("Error fetching blog:", error);
     res.status(500).json({ success: false, message: "Server error" });
  }
};

// Admin: Get all blogs (including drafts)
exports.getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({ success: true, data: blogs });
  } catch (error) {
    console.error("Error fetching admin blogs:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Admin: Create blog
exports.createBlog = async (req, res) => {
  try {
    const { title, excerpt, content, status } = req.body;
    const image = req.file ? req.file.path : req.body.image;
    
    // Simple slug generator
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newBlog = await Blog.create({
      title,
      slug,
      excerpt,
      content,
      image,
      status: status || "draft",
    });

    res.status(201).json({ success: true, data: newBlog });
  } catch (error) {
    console.error("Error creating blog:", error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Blog with this title already exists" });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Admin: Update blog
exports.updateBlog = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      if (updates.title) {
         updates.slug = updates.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
      }

      if (req.file) {
        updates.image = req.file.path;
      }
  
      const blog = await Blog.findByIdAndUpdate(id, updates, { new: true });
      
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
  
      res.json({ success: true, data: blog });
    } catch (error) {
      console.error("Error updating blog:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
};

// Admin: Delete blog
exports.deleteBlog = async (req, res) => {
    try {
      const { id } = req.params;
      await Blog.findByIdAndDelete(id);
      res.json({ success: true, message: "Blog deleted" });
    } catch (error) {
      console.error("Error deleting blog:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
};
