const Product = require("../models/Product");
const Blog = require("../models/Blog");
const Category = require("../models/Category");

const generateSitemap = async (req, res) => {
  try {
    const domain = "https://www.mannmatchyourself.com";
    const currentDate = new Date().toISOString().split("T")[0];

    // Static pages with their SEO properties
    const staticPages = [
      {
        url: "/",
        lastmod: currentDate,
        changefreq: "daily",
        priority: "1.0",
      },
      {
        url: "/new",
        lastmod: currentDate,
        changefreq: "weekly",
        priority: "0.9",
      },
      {
        url: "/shop",
        lastmod: currentDate,
        changefreq: "weekly",
        priority: "0.9",
      },
      {
        url: "/our-story",
        lastmod: currentDate,
        changefreq: "monthly",
        priority: "0.8",
      },
      {
        url: "/lookbook",
        lastmod: currentDate,
        changefreq: "monthly",
        priority: "0.8",
      },
      {
        url: "/blogs",
        lastmod: currentDate,
        changefreq: "weekly",
        priority: "0.8",
      },
      {
        url: "/review",
        lastmod: currentDate,
        changefreq: "monthly",
        priority: "0.7",
      },
      {
        url: "/login",
        lastmod: currentDate,
        changefreq: "monthly",
        priority: "0.6",
      },
      {
        url: "/signup",
        lastmod: currentDate,
        changefreq: "monthly",
        priority: "0.6",
      },
    ];

    // Fetch all active products
    const products = await Product.find({ isActive: true })
      .select("_id updatedAt")
      .lean();

    // Fetch all published blogs
    const blogs = await Blog.find({ status: "published" })
      .select("slug updatedAt")
      .lean();

    // Fetch all active categories
    const categories = await Category.find({ active: true })
      .select("slug updatedAt")
      .lean();

    // Build XML sitemap
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Add static pages
    staticPages.forEach((page) => {
      sitemap += `  <url>
    <loc>${domain}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    });

    // Add product pages
    products.forEach((product) => {
      const lastmod = product.updatedAt
        ? product.updatedAt.toISOString().split("T")[0]
        : currentDate;
      sitemap += `  <url>
    <loc>${domain}/product/${product._id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    });

    // Add blog pages
    blogs.forEach((blog) => {
      const lastmod = blog.updatedAt
        ? blog.updatedAt.toISOString().split("T")[0]
        : currentDate;
      sitemap += `  <url>
    <loc>${domain}/blogs/${blog.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
    });

    // Add category pages
    categories.forEach((category) => {
      const lastmod = category.updatedAt
        ? category.updatedAt.toISOString().split("T")[0]
        : currentDate;
      sitemap += `  <url>
    <loc>${domain}/category/${category.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    });

    sitemap += `</urlset>`;

    // Set appropriate headers
    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "public, max-age=3600"); // Cache for 1 hour
    res.status(200).send(sitemap);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).json({
      success: false,
      message: "Error generating sitemap",
      error: error.message,
    });
  }
};

module.exports = {
  generateSitemap,
};
