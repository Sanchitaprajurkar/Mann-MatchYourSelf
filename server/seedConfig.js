const mongoose = require("mongoose");
const Size = require("./models/Size.js");
const Color = require("./models/Color.js");
const Category = require("./models/Category.js");
require("dotenv").config(); // Load .env file

// Helper function to generate slug
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

async function seedConfig() {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB Atlas");

    // Seed sizes
    console.log("Seeding sizes...");
    const sizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
    for (const size of sizes) {
      const slug = generateSlug(size);
      await Size.findOneAndUpdate(
        { name: size },
        { name: size, slug },
        { upsert: true, new: true },
      );
    }
    console.log("Sizes seeded successfully");

    // Seed colors
    console.log("Seeding colors...");
    const colors = [
      "Black",
      "Gold",
      "Ivory",
      "Navy",
      "Maroon",
      "Wine",
      "Emerald",
      "Pink",
      "Red",
      "Blue",
    ];
    for (const color of colors) {
      const slug = generateSlug(color);
      await Color.findOneAndUpdate(
        { name: color },
        { name: color, slug },
        { upsert: true, new: true },
      );
    }
    console.log("Colors seeded successfully");

    // Seed categories
    console.log("Seeding categories...");
    const categories = [
      "Sarees",
      "Kurtis",
      "Lehengas",
      "Salwar Suits",
      "Dupattas",
      "Dresses",
      "Gowns",
      "Fusion Wear",
    ];
    for (const category of categories) {
      const slug = generateSlug(category);
      await Category.findOneAndUpdate(
        { name: category },
        { name: category, slug },
        { upsert: true, new: true },
      );
    }
    console.log("Categories seeded successfully");

    console.log("All config data seeded successfully!");

    // Display current counts
    const sizeCount = await Size.countDocuments({ active: true });
    const colorCount = await Color.countDocuments({ active: true });
    const categoryCount = await Category.countDocuments({ active: true });

    console.log(`\nCurrent counts:`);
    console.log(`Sizes: ${sizeCount}`);
    console.log(`Colors: ${colorCount}`);
    console.log(`Categories: ${categoryCount}`);
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  seedConfig();
}

module.exports = seedConfig;
