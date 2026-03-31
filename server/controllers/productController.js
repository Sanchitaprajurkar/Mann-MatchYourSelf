const mongoose = require("mongoose");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Order = require("../models/Order");
const User = require("../models/User");
const { upload } = require("../config/cloudinary");
const cloudinary = require("cloudinary").v2;

// Get all products (public)
const getAllProducts = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;

    // Build query
    const query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .populate("category", "name slug")
      .populate("sizes", "name slug")
      .populate("colors", "name slug hex")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: products,
    });
  } catch (error) {
    console.error("Get all products error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching products",
    });
  }
};

// Get single product (public)
const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name slug")
      .populate("sizes", "name slug")
      .populate("colors", "name slug hex");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Get single product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching product",
    });
  }
};

// Create new product (admin only)
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, sizes, colors, stock } =
      req.body;

    // Validation
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !sizes ||
      !colors ||
      stock === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // Parse arrays if they come as strings
    let parsedSizes, parsedColors;
    try {
      parsedSizes = Array.isArray(sizes) ? sizes : JSON.parse(sizes || "[]");
      parsedColors = Array.isArray(colors) ? colors : JSON.parse(colors || "[]");
    } catch (e) {
      console.error("Error parsing sizes/colors:", e);
      parsedSizes = [];
      parsedColors = [];
    }

    console.log("DEBUG - Received Body:", req.body);
    console.log("DEBUG - Received Files:", req.files);
    console.log("DEBUG - Parsed Sizes:", parsedSizes);
    console.log("DEBUG - Parsed Colors:", parsedColors);

    // Handle uploaded images
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => {
        // Cloudinary provides the full URL in file.path
        return file.path;
      });
    }

    // Create product with explicit ObjectId conversion
    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      category: new mongoose.Types.ObjectId(category), // Convert string to ObjectId
      sizes: parsedSizes.map((size) => new mongoose.Types.ObjectId(size)), // Convert array to ObjectIds
      colors: parsedColors.map((color) => new mongoose.Types.ObjectId(color)), // Convert array to ObjectIds
      stock: parseInt(stock),
      images,
      // Temporarily remove createdBy dependency until auth is properly implemented
      // createdBy: req.user._id,
    });

    console.log("DEBUG - Product before save:", product);

    await product.save();

    // Populate the references before returning
    await product.populate("category", "name slug");
    await product.populate("sizes", "name slug");
    await product.populate("colors", "name slug hex");

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating product",
    });
  }
};

// Update product (admin only)
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, sizes, colors, stock } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Update fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = parseFloat(price);
    if (sizes) {
      const parsedSizes = Array.isArray(sizes) ? sizes : JSON.parse(sizes);
      product.sizes = parsedSizes;
    }
    if (colors) {
      const parsedColors = Array.isArray(colors) ? colors : JSON.parse(colors);
      product.colors = parsedColors;
    }
    if (stock !== undefined) product.stock = parseInt(stock);

    // Handle new images if uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.path);
      product.images = [...product.images, ...newImages];
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating product",
    });
  }
};

// Delete product (admin only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        try {
          // Extract public_id from Cloudinary URL
          const publicId = imageUrl.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(
            `mann-match-yourself/products/${publicId}`,
          );
        } catch (error) {
          console.error("Error deleting image from Cloudinary:", error);
        }
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting product",
    });
  }
};

// Get dashboard stats (admin only)
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalProducts,
      totalCategories,
      totalUsers,
      totalOrders,
      totalStock,
      totalRevenue,
      openOrders,
      lowStockProducts,
      recentOrders,
      productsByCategory,
    ] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      User.countDocuments({ role: "user" }),
      Order.countDocuments(),
      Product.aggregate([{ $group: { _id: null, total: { $sum: "$stock" } } }]),
      Order.aggregate([
        { $match: { orderStatus: { $ne: "Cancelled" } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Order.countDocuments({
        $or: [
          { orderStatus: { $in: ["Placed", "Shipped"] } },
          { status: { $in: ["PLACED", "PROCESSING", "SHIPPED"] } },
        ],
      }),
      Product.find({ stock: { $lt: 10 } }).select("name stock").limit(10),
      Order.find()
        .populate("user", "name")
        .sort({ createdAt: -1 })
        .limit(5),
      Product.aggregate([
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "categoryData",
          },
        },
        { $unwind: { path: "$categoryData", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: "$category",
            name: { $first: "$categoryData.name" },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1, name: 1 } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalStock: totalStock[0]?.total || 0,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalUsers,
        openOrders,
        lowStockProducts,
        totalCategories,
        recentOrders,
        productsByCategory,
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching dashboard stats",
    });
  }
};

module.exports = {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getDashboardStats,
};
