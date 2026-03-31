require("dotenv").config(); // ✅ Load .env FIRST before anything else

const express = require("express");

const cors = require("cors");

const connectDB = require("./config/db");
const createDefaultAdmin = require("./utils/createDefaultAdmin");

const path = require("path");

// Connect to MongoDB Atlas (dotenv is loaded in db.js)
connectDB().then(() => {
  // 6. Run automatically after MongoDB connection
  createDefaultAdmin();
});

const app = express();

const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: ["http://localhost:5173", "https://mannmatchyourself.com", "https://www.mannmatchyourself.com"],
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));

app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api", (req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
});

// 🔍 REQUEST LOGGING MIDDLEWARE

app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.url}`);

  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`🌐 Body:`, JSON.stringify(req.body, null, 2));
  }

  next();
});

// Serve static files from uploads directory

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Import routes

const userAuthRoutes = require("./routes/userAuthRoutes");

const adminAuthRoutes = require("./routes/adminAuthRoutes"); // Admin auth

const productRoutes = require("./routes/productRoutes");

const orderRoutes = require("./routes/orderRoutes");

const adminOrderRoutes = require("./routes/adminOrderRoutes");

const paymentRoutes = require("./routes/paymentRoutes");

const cartRoutes = require("./routes/cartRoutes");

const wishlistRoutes = require("./routes/wishlistRoutes");

const heroRoutes = require("./routes/heroRoutes");

const adminRoutes = require("./routes/admin");

const uploadRoutes = require("./routes/uploadRoutes");

const configRoutes = require("./routes/configRoutes");

const addressRoutes = require("./routes/addressRoutes");

const leadRoutes = require("./routes/leadRoutes");

const settingsRoutes = require("./routes/settingsRoutes");

// Use routes

app.use("/api/auth", userAuthRoutes); // User auth (login, signup)

app.use("/api/admin/auth", adminAuthRoutes); // Admin auth

app.use("/api/products", productRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/admin/orders", adminOrderRoutes);

app.use("/api/payment", paymentRoutes);

app.use("/api/wishlist", wishlistRoutes);

app.use("/api/hero", heroRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/upload", uploadRoutes);

app.use("/api/config", configRoutes);

app.use("/api/addresses", addressRoutes);

app.use("/api/leads", leadRoutes);

app.use("/api/settings", settingsRoutes);

const reviewRoutes = require("./routes/reviewRoutes");
app.use("/api/reviews", reviewRoutes);

const blogRoutes = require("./routes/blogRoutes");
app.use("/api/blogs", blogRoutes);

const offerRoutes = require("./routes/offerRoutes");
app.use("/api/offers", offerRoutes);

const couponRoutes = require("./routes/couponRoutes");
app.use("/api/coupons", couponRoutes);

app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.originalUrl}`,
  });
});

// Sitemap route
const { generateSitemap } = require("./controllers/sitemapController");
app.get("/sitemap.xml", generateSitemap);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to MANN Match Yourself API" });
});

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve static files from client public directory
app.use(express.static(path.join(__dirname, "../client/public")));

// Test route

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is running" });
});

// 🔥 GLOBAL ERROR HANDLING - MUST BE LAST

app.use((err, req, res, next) => {
  console.error("🔥 UNHANDLED ERROR:", err);

  console.error("🔥 ERROR STACK:", err.stack);

  console.error("🔥 REQUEST URL:", req.url);

  console.error("🔥 REQUEST METHOD:", req.method);

  console.error("🔥 REQUEST BODY:", req.body);

  console.error("🔥 REQUEST HEADERS:", req.headers);

  res.status(500).json({
    success: false,

    message: "Internal Server Error",

    error: err.message,

    stack: err.stack,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  console.log(`Test API: http://localhost:${PORT}/api/test`);

  console.log(`Auth API: http://localhost:${PORT}/api/auth`);

  console.log(`Products API: http://localhost:${PORT}/api/products`);

  console.log(`Orders API: http://localhost:${PORT}/api/orders`);

  console.log(`Payment API: http://localhost:${PORT}/api/payment`);

  console.log("✅ Address Routes Loaded: /api/addresses");
});
