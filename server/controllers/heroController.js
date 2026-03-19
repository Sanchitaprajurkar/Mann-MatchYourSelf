const HeroSlide = require("../models/HeroSlide");

// GET slides (frontend)
const getHeroSlides = async (req, res) => {
  try {
    const slides = await HeroSlide.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json({
      success: true,
      data: slides,
    });
  } catch (error) {
    console.error("Get hero slides error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching hero slides",
    });
  }
};

// ADD slide (admin)
const addHeroSlide = async (req, res) => {
  try {
    const { title, subtitle, cta, link, order = 0 } = req.body;

    let image = null;

    // Handle both Cloudinary and local storage
    if (req.file) {
      // Cloudinary returns the file info differently
      if (req.file.path && req.file.path.startsWith("http")) {
        // Cloudinary upload
        image = req.file.path; // This is actually the secure_url
      } else if (req.file.secure_url) {
        // Alternative Cloudinary response
        image = req.file.secure_url;
      } else {
        // Local storage fallback
        image = `/uploads/${req.file.filename}`;
      }
    }

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const slide = await HeroSlide.create({
      title,
      subtitle,
      cta,
      link,
      order: parseInt(order),
      image,
    });

    res.status(201).json({
      success: true,
      data: slide,
      message: "Hero slide added successfully",
    });
  } catch (error) {
    console.error("Add hero slide error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding hero slide",
    });
  }
};

// DELETE slide (admin)
const deleteHeroSlide = async (req, res) => {
  try {
    const { id } = req.params;

    const slide = await HeroSlide.findById(id);
    if (!slide) {
      return res.status(404).json({
        success: false,
        message: "Hero slide not found",
      });
    }

    await HeroSlide.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Hero slide deleted successfully",
    });
  } catch (error) {
    console.error("Delete hero slide error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting hero slide",
    });
  }
};

// UPDATE slide (admin)
const updateHeroSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, cta, link, order, isActive } = req.body;

    const slide = await HeroSlide.findById(id);
    if (!slide) {
      return res.status(404).json({
        success: false,
        message: "Hero slide not found",
      });
    }

    let updateData = {
      title,
      subtitle,
      cta,
      link,
      order: parseInt(order),
      isActive: isActive !== undefined ? isActive : slide.isActive,
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

    const updatedSlide = await HeroSlide.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json({
      success: true,
      data: updatedSlide,
      message: "Hero slide updated successfully",
    });
  } catch (error) {
    console.error("Update hero slide error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating hero slide",
    });
  }
};

// GET all slides (admin - includes inactive)
const getAllHeroSlides = async (req, res) => {
  try {
    const slides = await HeroSlide.find().sort({ order: 1 });
    res.status(200).json({
      success: true,
      data: slides,
    });
  } catch (error) {
    console.error("Get all hero slides error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching hero slides",
    });
  }
};

module.exports = {
  getHeroSlides,
  getAllHeroSlides,
  addHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
};
