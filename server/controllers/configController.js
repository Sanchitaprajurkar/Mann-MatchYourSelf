const Size = require("../models/Size.js");
const Color = require("../models/Color.js");
const Category = require("../models/Category.js");

// Helper function to generate slug
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const getSizes = async (req, res) => {
  try {
    const sizes = await Size.find({ active: true }).sort({ name: 1 });
    res.json(sizes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching sizes", error: error.message });
  }
};

const addSize = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Size name is required" });
    }

    const slug = generateSlug(name.trim());

    // Check if size already exists
    const existingSize = await Size.findOne({ name: name.trim() });
    if (existingSize) {
      return res.status(400).json({ message: "Size already exists" });
    }

    const size = await Size.create({ name: name.trim(), slug });
    res.status(201).json(size);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding size", error: error.message });
  }
};

const getColors = async (req, res) => {
  try {
    const colors = await Color.find({ active: true }).sort({ name: 1 });
    res.json(colors);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching colors", error: error.message });
  }
};

const addColor = async (req, res) => {
  try {
    const { name, hex } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Color name is required" });
    }

    const slug = generateSlug(name.trim());

    // Check if color already exists
    const existingColor = await Color.findOne({ name: name.trim() });
    if (existingColor) {
      return res.status(400).json({ message: "Color already exists" });
    }

    const color = await Color.create({ name: name.trim(), slug, hex });
    res.status(201).json(color);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding color", error: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1, name: 1 });
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching categories",
        error: error.message,
      });
  }
};

const addCategory = async (req, res) => {
  try {
    const { name, slug, showOnHome, order, active } = req.body;

    if (!name || !name.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Category name is required" });
    }

    const generatedSlug = slug || generateSlug(name.trim());

    // Check if category already exists
    const existingCategory = await Category.findOne({
      $or: [{ name: name.trim() }, { slug: generatedSlug }],
    });
    if (existingCategory) {
      return res
        .status(400)
        .json({ success: false, message: "Category already exists" });
    }

    let image = null;
    // Handle image upload
    if (req.file) {
      if (req.file.path && req.file.path.startsWith("http")) {
        image = req.file.path;
      } else if (req.file.secure_url) {
        image = req.file.secure_url;
      } else {
        image = `/uploads/${req.file.filename}`;
      }
    }

    const category = await Category.create({
      name: name.trim(),
      slug: generatedSlug,
      image,
      showOnHome: showOnHome || false,
      order: parseInt(order) || 0,
      active: active !== undefined ? active : true,
    });

    res.status(201).json({
      success: true,
      data: category,
      message: "Category created successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error adding category",
        error: error.message,
      });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, showOnHome, order, active } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    let updateData = {
      name: name ? name.trim() : category.name,
      slug: slug || category.slug,
      showOnHome: showOnHome !== undefined ? showOnHome : category.showOnHome,
      order: order !== undefined ? parseInt(order) : category.order,
      active: active !== undefined ? active : category.active,
    };

    // Handle image update if new image uploaded
    if (req.file) {
      let image = null;
      if (req.file.path && req.file.path.startsWith("http")) {
        image = req.file.path;
      } else if (req.file.secure_url) {
        image = req.file.secure_url;
      } else {
        image = `/uploads/${req.file.filename}`;
      }
      updateData.image = image;
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json({
      success: true,
      data: updatedCategory,
      message: "Category updated successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error updating category",
        error: error.message,
      });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error deleting category",
        error: error.message,
      });
  }
};

module.exports = {
  getSizes,
  addSize,
  getColors,
  addColor,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};
